/**
 * apps/web/src/pages/api/account/delete.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.07.2022
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import sendMail, { sendMailV2 } from "@codeup/util/src/sendMail";
import generateMail from "@codeup/util/src/generateMail";
import UserModel from "@codeup/util/src/models/UserModel";
import * as crypto from "crypto";
import checkPassword from "@codeup/util/src/checkPassword";
import jwt from "jsonwebtoken";
import DeleteUserEmail from "@codeup/components/emails/DeleteUser";
import { render } from "@react-email/render";

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
      error: "Auth-Header is missing",
    });
    return;
  }

  // @ts-ignore
  jwt.verify(
    req.headers["x-jwt"] as string,
    process.env.JWT_SECRET as string,
    async (err, decoded) => {
      if (err) {
        res.status(400).json({
          error: "Invalid token",
          details: err,
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

      await sendMailV2({
        to: user.email,
        subject: "Konto gelöscht",
        text: "Dein Konto wurde erfolgreich gelöscht!",
        html: render(<DeleteUserEmail firstName={user.firstName} />)
      })
      await user.remove();

      // DELETE: CommunityProfile, CommunityPosts, TodoLists with no contributors, IDEProjects with no contributors
      // DELETE: CourseProgress

      res.status(200).json({
        success: true,
        message: "Deleted.",
      });
    }
  );
}
