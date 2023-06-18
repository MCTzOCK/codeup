/**
 * apps/web/src/pages/api/payments/cancelSubscription.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.06.23
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import UserModel from "@codeup/util/dist/models/UserModel";
import { decode, verify } from "jsonwebtoken";
import Stripe from "stripe";
import generateJWT from "@codeup/util/dist/generateJWT";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const jwt = req.headers["x-jwt"] as string;

    if (!jwt) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const decoded = verify(jwt, process.env.JWT_SECRET as string) as any;

    if (!decoded) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    if (user.subscription !== "PRO") {
      res.status(403).json({
        error: "Forbidden",
      });
      return;
    }

    if (!user.stripeSubscriptionId || user.stripeSubscriptionId.length === 0) {
      res.status(400).json({
        error: "Bad Request",
      });
      return;
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2022-11-15",
    });

    const subscription = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId
    );

    if (!subscription) {
      res.status(400).json({
        error: "Bad Request",
      });
      return;
    }

    await stripe.subscriptions.cancel(user.stripeSubscriptionId);

    user.subscription = "FREE";
    user.stripeSubscriptionId = "";
    await user.save();

    res.status(200).json({
      success: true,
      jwt: generateJWT(user),
    });
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
}
