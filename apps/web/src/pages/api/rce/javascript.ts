/**
 * apps/web/src/pages/api/rce/javascript.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import Docker from "dockerode";

const docker = new Docker();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({
        status: 405,
        error: "Method not allowed",
      });
      return;
    }

    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    const { code } = req.body;

    if (!code) {
      res.status(400).json({
        status: 400,
        error: "No code provided",
      });
      return;
    }

    try {
      const container = await docker.createContainer({
        Image: "node",
        Cmd: ["node", "-e", code, "> /dev/stdout"],
        Tty: true,
        NetworkDisabled: true,
      });

      setTimeout(async () => {
        try {
          const logs = await container.logs({
            stdout: true,
            stderr: true,
          });

          res.status(200).json({
            status: 200,
            logs: logs.toString(),
          });

          await container.kill();
          await container.remove();
        } catch (e) {}
      }, 1000 * 5);

      await container.start();
    } catch (e: any) {
      res.status(500).json({
        status: 500,
        error: e.message,
      });
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
