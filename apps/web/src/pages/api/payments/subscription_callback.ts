/**
 * apps/web/src/pages/api/payments/subscription_callback.ts
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

    if (req.method !== "GET") {
      res.status(405).json({
        error: "Method not allowed"
      });
      return;
    }

    const {session_id} = req.query;

    if(!session_id) {
      res.redirect("/error?error=Keine Session ID übermittelt. Bitte kontaktiere den Support.");
      return;
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2022-11-15"
    });

    const session = await stripe.checkout.sessions.retrieve(session_id as string);

    if(!session) {
      res.redirect("/error?error=Die Session ID ist ungültig. Bitte kontaktiere den Support.");
      return;
    }

    console.log(session.customer)

    const user = await UserModel.findOne({
      stripeCustomerId: session.customer
    });

    if(!user) {
      res.redirect("/error?error=Der Benutzer konnte nicht gefunden werden. Bitte kontaktiere den Support.");
      return;
    }

    if(session.payment_status === "paid") {
      user.subscription = "PRO";
      user.stripeSubscriptionId = session.subscription;
      await user.save();
      res.redirect("/payment/success/thank_you");
    } else {
      res.redirect("/error?error=Die Zahlung ist fehlgeschlagen. Bitte kontaktiere den Support.");
    }

  } catch (e: any) {
    res.status(500).json({
      error: e.message
    });
  }
}