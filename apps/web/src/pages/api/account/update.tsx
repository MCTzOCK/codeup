/**
 * src/pages/api/account/update.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import mongoConnect from "@codeup/util/src/mongo";
import checkPassword from "@codeup/util/src/checkPassword";
import generateJWT from "@codeup/util/src/generateJWT";
import { uuid } from "uuidv4";
import sendMail, { sendMailV2 } from "@codeup/util/src/sendMail";
import * as crypto from "crypto";
import { render } from "@react-email/render";
import UpdateEmail from "@codeup/components/emails/UpdateEmail";

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

  if (
    !req.body ||
    !req.headers["x-jwt"] ||
    !req.body.keyName ||
    !req.body.keyValue
  ) {
    res.status(400).json({
      error: "Missing parameters",
    });
    return;
  }

  const token = req.headers["x-jwt"] as string;

  if (jwt.verify(token, process.env.JWT_SECRET as string)) {
    const decoded = jwt.decode(token) as any;

    await mongoConnect();

    const user = await UserModel.findOne({
      _id: decoded.id,
    });

    if (!user) {
      res.status(404).json({
        error: "User not found",
      });
      return;
    }

    let allowedKeyNames = ["firstName", "lastName", "email", "2fa", "password"];

    if (!allowedKeyNames.includes(req.body.keyName)) {
      res.status(400).json({
        error: "Invalid key name",
      });
      return;
    }

    let ret = true;

    switch (req.body.keyName) {
      case "firstName":
        user.firstName = req.body.keyValue;
        break;
      case "lastName":
        user.lastName = req.body.keyValue;
        break;
      case "email":
        ret = false;
        if (
          !req.body.keyValue.match(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
        ) {
          res.status(400).json({
            error: "Invalid email",
          });
        } else {
          if (user.emailChangeCode !== "" && user.emailChangeCode !== null) {
            res.status(400).json({
              error: "Email change code already sent",
            });
          }
          if (
            await UserModel.findOne({
              email: req.body.email,
            })
          ) {
            res.status(400).json({
              error: "Email already in use",
            });
          } else {
            user.emailChangeCode = uuid();
            user.newEmail = req.body.keyValue;

            await sendMailV2({
              to: user.email,
              subject: "E-Mail Adresse ändern",
              text: "",
              html: render(<UpdateEmail firstName={user.firstName} link={`https://${req.headers.host}/api/account/action?operation=changeEmail&token=${user.emailChangeCode}&redirect=${encodeURIComponent(`https://${req.headers.host}/account/settings?component=account&newToken=${generateJWT(user)}`)}`} />)
            })

            res.status(200).json({
              success: true,
              message: "Please check your email for a verification code",
            });
          }
        }
        break;
      case "2fa":
        user.twoFactorEnabled = req.body.keyValue === "true";
        break;
      case "password":
        const password = req.body.keyValue;

        if (!checkPassword(password)) {
          res.status(400).json({
            error:
              "Das Passwort muss aus mindestens 8 Buchstaben, einen Großbuchstaben, einen Kleinbuchstaben eine Ziffer und ein Sonderzeichen bestehen.",
          });
          return;
        }

        user.password = crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");
        break;
    }

    await user.save();

    if (ret) {
      res.status(200).json({
        success: true,
        newToken: generateJWT(user),
      });
    }
  } else {
    res.status(401).json({
      error: "Invalid token",
    });
  }
}
