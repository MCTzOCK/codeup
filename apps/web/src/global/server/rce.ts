/**
 * apps/web/src/global/server/rce/rce.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.05.2024
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import Docker from "dockerode";
import { isLoggedIn } from "./isLoggedIn";
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { tmpdir } from "node:os";

const docker = new Docker();

export async function rce(
  req: NextApiRequest,
  res: NextApiResponse,
  options: {
    timeout: number;
    image: string;
    env: string[];
    cmd?: string[];
    entrypoint?: string[];
    code: string;
    tmpfs: {
      [key: string]: string;
    };
  }
) {
  if (req.method !== "POST") {
    res.status(405).json({
      status: 405,
      error: "Method not allowed",
    });
    return;
  }

  const { auth, user } = await isLoggedIn(req, res);

  if (!auth) return;

  try {
    const tempFile = `codeup-rce-${new Date().getTime()}-${
      user._id
    }-${createHash("sha256")
      .update(options.code)
      .digest("hex")
      .substring(0, 10)}`;

    fs.mkdirSync(path.join(tmpdir(), tempFile), { recursive: true });

    for (const key of Object.keys(options.tmpfs)) {
      fs.writeFileSync(path.join(tmpdir(), tempFile, key), options.tmpfs[key]);
    }

    const container = await docker.createContainer({
      name: `codeup-rce-${new Date().getTime()}-${user._id}-${createHash(
        "sha256"
      )
        .update(options.code)
        .digest("hex")
        .substring(0, 10)}`,
      Image: options.image,
      Cmd: options.cmd,
      Entrypoint: options.entrypoint,
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
      Tty: true,
      Env: options.env,
      NetworkDisabled: true,
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
    }, 1000 * options.timeout);
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
