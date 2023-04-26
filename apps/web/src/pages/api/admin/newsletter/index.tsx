/**
 * apps/web/src/pages/api/admin/newsletter/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.04.2023
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import NewsletterModel from "@codeup/util/src/models/NewsletterModel";
import sendMail from "@codeup/util/dist/sendMail";
import { sendMailV2 } from "@codeup/util/src/sendMail";
import { render } from "@react-email/render";
import NewsletterEmail from "@codeup/components/emails/Newsletter";

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

  if (!req.headers["x-jwt"]) {
    res.status(400).json({
      error: "Missing Auth-Header (x-jwt)",
    });
    return;
  }

  if (!req.body || !req.body.title || !req.body.content) {
    res.status(400).json({
      error: "Missing parameters",
    });
    return;
  }

  jwt.verify(
    req.headers["x-jwt"] as string,
    process.env.JWT_SECRET as string,
    async (err: VerifyErrors | null, decoded: JwtPayload | string | any) => {
      if (err) {
        res.status(400).json({
          error: "Invalid token",
        });
        return;
      }

      await mongoConnect();

      const user = await UserModel.findById((decoded as any).id);

      if (!user) {
        res.status(400).json({
          error: "Invalid token",
        });
        return;
      }

      if (user.role !== "admin") {
        res.status(403).json({
          error: "You are not allowed to do this",
        });
        return;
      }

      const newsletterMembers = await NewsletterModel.find({});

      for (const member of newsletterMembers) {
        const user = await UserModel.findById(member.user);

        if (!user) {
          continue;
        }

        if(user.email.endsWith("users.codeup.space")) continue;

        await sendMailV2({
          to: user.email,
          subject: req.body.title,
          text: req.body.content,
          html: render(<NewsletterEmail firstName={user.firstName} content={req.body.content} />)
        })
      }

      res.status(200).json({
        success: true,
      });
    }
  );
}
