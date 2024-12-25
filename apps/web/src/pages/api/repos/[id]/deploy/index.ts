/**
 * apps/web/src/pages/api/repos/[id]/deploy/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.12.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../../global/server/isLoggedIn";
import RepositoryModel from "@codeup/util/dist/models/RepositoryModel";
import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import Logger from "../../../../../server/logger";
import { NProxyMGR } from "../../../../../global/server/nproxymgr";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    const { auth, user } = await isLoggedIn(req, res);
    if (!auth) return;

    if (!id) {
      res.status(400).json({
        status: 400,
        error: "Invalid Request",
      });
      return;
    }

    const repo = await RepositoryModel.findById(id);

    if (!repo) {
      res.status(404).json({
        status: 404,
        error: "Project not found",
      });
      return;
    }

    if (repo.user.toString() !== user._id.toString()) {
      res.status(403).json({
        status: 400,
        error: "You are not allowed to view this repo",
      });
      return;
    }

    const time = new Date().getTime();

    const pathName = path.join(
      process.env.TMP_DIR as string,
      `${repo._id}_${time}`
    );

    fs.mkdirSync(pathName, {
      recursive: true,
    });

    execSync(
      `git clone --depth 1 ${process.env.GIT_SERVER_HOME}/${user.username}/${repo.name} ${pathName}`
    );

    execSync(`docker container rm -f ${repo.username}_${repo._id}`);

    const port = await getOpenPort();

    if (port === -1) {
      Logger.error(`No open port found for project ${repo._id}`, Logger.WEB);
      res.status(500).json({
        status: 500,
        error: "No open port found",
      });
      return;
    }

    if (repo.deploymentType === "static") {
      const command = `docker run -d --restart unless-stopped -p ${port}:80 -v ${pathName}:/usr/share/nginx/html --name ${repo.username}_${repo._id} nginx:alpine`;

      execSync(command);
    } else {
      execSync(`docker build -t ${repo.username}_${repo._id}:${time} .`, {
        cwd: pathName,
      });

      execSync(
        `docker run -d --restart unless-stopped -p ${port}:80 --name ${repo.username}_${repo._id} ${repo.username}_${repo._id}:${time}`
      );
    }

    const n = new NProxyMGR();
    await n.getToken();

    const existing = await n.existsProxy(
      `${repo.deploymentName}.user-content.dev`
    );

    if (existing !== -1) {
      await n.deleteProxy(existing);
    }

    const domain = `${repo.deploymentName}.user-content.dev`;

    const success = await n.createProxy({
      access_list_id: "0",
      advanced_config: "",
      allow_websocket_upgrade: true,
      block_exploits: false,
      caching_enabled: false,
      certificate_id: parseInt(
        (process.env.NPROYXMGR_WD_CERT_ID_PROJECTS as string) || "0"
      ),
      domain_names: [domain],
      forward_host: `${process.env.NPROXYMGR_REAL_SRV_ENDPOINT}`,
      forward_port: port,
      forward_scheme: "http",
      hsts_enabled: false,
      hsts_subdomains: false,
      http2_support: false,
      locations: [],
      meta: {
        dns_challenge: false,
        letsencrypt_agree: false,
      },
      ssl_forced: true,
    });

    if (!success) {
      res.status(500).json({
        status: 500,
        error: "Could not create proxy",
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: "Deployed",
      url: `https://${domain}`,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}

async function getOpenPort(): Promise<number> {
  const min = 28000;
  const max = 29000;
  let port = -1;

  for (let i = min; i < max; i++) {
    const isOpen = await isPortOpen(i);

    if (isOpen) {
      port = i;
      break;
    }
  }

  return port;
}

async function isPortOpen(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = require("net").createServer();
    server.listen(port, () => {
      server.close();
      resolve(true);
    });
    server.on("error", () => {
      resolve(false);
    });
  });
}
