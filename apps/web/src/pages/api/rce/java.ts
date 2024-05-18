/**
 * apps/web/src/pages/api/rce/java.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import Docker from "dockerode";
import { createHash } from "crypto";
import path from "path";
import { tmpdir } from "node:os";
import fs from "fs";

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

    let extractedClassName = code.match(/public class (\w+)/)?.[1];

    try {
      const tempFile = `codeup-rce-${new Date().getTime()}-${
        user._id
      }-${createHash("sha256").update(code).digest("hex").substring(0, 10)}`;

      fs.mkdirSync(path.join(tmpdir(), tempFile), { recursive: true });

      fs.writeFileSync(
        path.join(tmpdir(), tempFile, `${extractedClassName}.java`),
        code
      );

      fs.writeFileSync(
        path.join(tmpdir(), tempFile, "r.sh"),
        `#!/bin/bash\njavac ${extractedClassName}.java && java ${extractedClassName}`
      );

      const container = await docker.createContainer({
        name: `codeup-rce-${new Date().getTime()}-${user._id}-${createHash(
          "sha256"
        )
          .update(code)
          .digest("hex")
          .substring(0, 10)}`,
        Image: "mctzock/codeup-java-rce:latest",
        Tty: true,
        NetworkDisabled: true,
        Entrypoint: ["/usr/src/app/r.sh"],
        HostConfig: {
          Mounts: [
            {
              Type: "bind",
              Source: path.join(tmpdir(), tempFile),
              Target: "/usr/src/app",
              ReadOnly: false,
            },
          ],
        },
      });
      await container.start();

      container.attach(
        { stream: true, stdout: true, stderr: true },
        (err, stream) => {
          if (err) {
            res.status(500).json({
              status: 500,
              error: err.message,
            });
            return;
          }

          if (!stream) {
            res.status(500).json({
              status: 500,
              error: "No stream",
            });
            return;
          }
          res.setHeader("Content-Type", "text/plain");
          stream.pipe(res);
        }
      );

      setTimeout(async () => {
        try {
          await container.remove({ force: true });
          fs.rmdirSync(path.join(tmpdir(), tempFile), { recursive: true });
        } catch (e) {}
      }, 1000 * 2.5);
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
