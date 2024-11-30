/**
 * apps/web/src/pages/api/cloud-computing/attach.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.11.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import Kasm from "../../../global/kasm";
import { randomBytes } from "crypto";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    const kasm = Kasm.getKasm();

    const kasmUserReq = await kasm.makeAuthenticatedCall(
      "/api/public/get_user",
      "POST",
      {
        target_user: {
          username: "auto_" + user.username,
        },
      }
    );

    if (kasmUserReq.error_message) {
      const kasmUser = await kasm.makeAuthenticatedCall(
        "/api/public/create_user",
        "POST",
        {
          target_user: {
            username: "auto_" + user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            locked: false,
            disabled: false,
            password: randomBytes(32).toString("hex"),
          },
        }
      );

      const kasmGroup = await kasm.makeAuthenticatedCall(
        "/api/public/add_user_group",
        "POST",
        {
          target_user: {
            user_id: kasmUser.user.user_id,
          },
          target_group: {
            group_id: "fe6761905c374c6e887bdf7a288f28d0",
          },
        }
      );
    }

    const kasmKasm = await kasm.makeAuthenticatedCall(
      "/api/public/get_kasms",
      "POST",
      {}
    );

    const existingKasm = kasmKasm.kasms.find(
      (k: any) => k.user.username === "auto_" + user.username
    );

    if (existingKasm) {
    }

    res.status(200).json({
      status: 200,
      message: "User attached to Kasm",
    });
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
