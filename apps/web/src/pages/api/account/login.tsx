/**
 * src/pages/api/account/Login.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import UserModel from "@codeup/util/src/models/UserModel";
import * as crypto from "crypto";
import generateJWT from "@codeup/util/src/generateJWT";
import { default as sm, sendMailV2 } from "@codeup/util/src/sendMail";
import { authenticator } from "otplib";
import { render } from "@react-email/render";
import LoginEmail from "@codeup/components/emails/Login";
import Stripe from "stripe";
import { addXP } from "@codeup/util/dist/userworkflow/xp";
import { actionMap } from "../../../global/levels";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.body || !req.body.password) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  if (!req.body.email && !req.body.username) {
    res.status(400).json({
      error: "Missing either E-Mail oder Username",
    });
    return;
  }

  try {
    await mongoConnect();

    let user: any | null = null;

    if (req.body.email) {
      user = await UserModel.findOne({ email: req.body.email });
    }

    if (req.body.username) {
      user = await UserModel.findOne({ username: req.body.username });
    }

    if (!user) {
      res.status(400).json({
        error: "Benutzer nicht gefunden",
      });
      return;
    }

    if (
      crypto.createHash("sha256").update(req.body.password).digest("hex") !==
      user.password
    ) {
      res.status(400).json({
        error: "Falsches Passwort",
      });
      return;
    }

    if (!user.active) {
      res.status(400).json({
        error:
          "Konto nicht aktiviert. Überprüfen Sie Ihre E-Mail für einen Aktivierungslink.",
      });
      return;
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2022-11-15",
    });

    if (user.stripeSubscriptionId && user.stripeSubscriptionId !== "") {
      const subscription = await stripe.subscriptions.retrieve(
        user.stripeSubscriptionId
      );
      console.log(subscription);
      if (subscription.status !== "active") {
        user.subscription = "FREE";
        user.stripeSubscriptionId = "";
        await user.save();
      }
    }

    if (!user.twoFactorEnabled) {
      await sendMail(user.email, user.firstName, user._id);
      res.status(200).json({
        error: null,
        token: generateJWT(user),
      });
      return;
    } else {
      if (req.body.code) {
        if (!authenticator.check(req.body.code, user.twoFactorSecret)) {
          res.status(400).json({
            error: "Falscher Code",
          });
          return;
        }

        user.twoFactorCode = null;
        await user.save();

        await sendMail(user.email, user.firstName, user._id);

        res.status(200).json({
          success: true,
          token: generateJWT(user),
        });
        return;
      } else {
        res.status(200).json({
          error: null,
          _2fa: true,
        });
        return;
      }
    }
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      // @ts-ignore
      message: e.message,
      // @ts-ignore
      stack: e.stack,
    });
    return;
  }
}

const sendMail = async (email: string, firstName: string, userId: string) => {
  await sendMailV2({
    to: email,
    subject: "Angemeldet",
    html: await render(<LoginEmail firstName={firstName} />),
    text: "",
  });

  addXP(userId, actionMap["Einloggen"], "Einloggen");
};
