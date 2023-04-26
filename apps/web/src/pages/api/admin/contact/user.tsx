/**
 * apps/web/src/pages/api/admin/contact/user.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.11.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import ContactModel from "@codeup/util/src/models/ContactModel";
import UserModel from "@codeup/util/src/models/UserModel";
import mongoConnect from "@codeup/util/src/mongo";
import { verify } from "jsonwebtoken";
import CourseModel from "@codeup/util/src/models/CourseModel";
import sendMail, { sendMailV2 } from "@codeup/util/src/sendMail";
import { render } from "@react-email/render";
import PrivateMessageEmail from "@codeup/components/emails/PrivateMessage";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.body.username || !req.body.message) {
    res.status(400).json({
      error: "Bad Request",
    });
    return;
  }

  try {
    const jwt = req.headers["x-jwt"];
    if (!verify(jwt as string, process.env.JWT_SECRET as string)) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const decoded = verify(
      jwt as string,
      process.env.JWT_SECRET as string
    ) as any;

    const adminuser = await UserModel.findOne({ username: decoded.username });

    if (adminuser.role !== "admin") {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    await mongoConnect();

    const user = await UserModel.findOne({ username: req.body.username });

    if (!user) {
      res.status(404).json({
        error: "User not found",
      });
      return;
    }

    await sendMailV2({
      to: user.email,
      subject: "Nachricht von CodeUp",
      text: req.body.message,
      html: render(<PrivateMessageEmail firstName={user.firstName} content={req.body.message} />)
    });


    res.status(200).json({
      success: true,
    });
  } catch (e) {
    // @ts-ignore
    if (e.message) {
      res.status(500).json({
        // @ts-ignore
        error: "Internal Server Error:" + e.message,
        success: false,
      });
    } else {
      res.status(500).json({
        error: "Internal Server Error: Unknown Error",
        success: false,
      });
    }
  }
}
