/**
 * apps/web/src/pages/api/payments/createCheckoutSession.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.06.2023
 *
 */

import {NextApiRequest, NextApiResponse} from "next";
import Stripe from "stripe";
import { decode } from "jsonwebtoken";
import UserModel from "@codeup/util/dist/models/UserModel";
import mongoConnect from "@codeup/util/dist/mongo";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {

    await mongoConnect();

    if(req.method !== "POST") {
      res.status(405).json({
        error: "Method not allowed"
      });
      return;
    }

    const jwt = req.headers["x-jwt"] as string;

    if(!jwt) {
      res.status(401).json({
        error: "Unauthorized"
      });
      return;
    }

    const decoded = await decode(jwt) as any;

    if(!decoded) {
      res.status(401).json({
        error: "Unauthorized"
      });
      return;
    }

    const user = await UserModel.findById(decoded["id"] as string);

    if(!user) {
      res.status(401).json({
        error: "Unauthorized"
      });
      return;
    }

    if(!user.active || user.role === "admin" || user.subscription === "PRO") {
      res.status(403).json({
        error: "Forbidden"
      });
      return;
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2022-11-15",
    });

    let customerId: string = "";

    if(!user.stripeCustomerId || user.stripeCustomerId.length === 0) {
      customerId = (await stripe.customers.create({
        email: user.email
      })).id;
    } else {
      customerId = user.stripeCustomerId;
    }

    user.stripeCustomerId = customerId;
    await user.save();

    const session = await stripe.checkout.sessions.create({
      success_url: `${req.headers.origin}/api/payments/subscription_callback?session_id={CHECKOUT_SESSION_ID}`,
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_CODEUP_PRO_PRICE_ID as string,
          quantity: 1
        }
      ]
    })

    res.status(200).json({
      url: session.url as string
    })

  } catch (e: any) {
    res.status(500).json({
      error: e.message
    });
  }

}