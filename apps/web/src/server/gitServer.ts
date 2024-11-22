/**
 * apps/web/src/server/gitServer.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.11.2024
 *
 */
import { IncomingMessage, ServerResponse } from "node:http";
import UserModel from "@codeup/util/dist/models/UserModel";
import { createHash } from "crypto";
import http from "node:http";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { existsSync } from "node:fs";

const PORT = process.env.GIT_PORT ? parseInt(process.env.GIT_PORT) : 3002;

const GIT_PATH = process.env.GIT_DATA_HOME as string;
if (!GIT_PATH) {
  console.error("Error: GIT_DATA_HOME environment variable is not set.");
  process.exit(1);
}

function resolveRepoPath(repoName: string) {
  const repoPath = join(GIT_PATH, repoName);
  if (existsSync(repoPath)) {
    return repoPath;
  }
  return null;
}

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url as string;

    console.log(`Incoming request: ${req.method} ${url}`);

    const urlParts = url.split("/");
    if (urlParts.length < 3) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Repository not found");
      return;
    }

    const repoName = urlParts[1] + "/" + urlParts[2];
    const repoPath = resolveRepoPath(repoName);
    if (!repoPath) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Repository not found");
      return;
    }
    let realPath = url.split("?")[0];

    const auth = await authenticate(req, res, repoName);

    if (!auth) {
      return;
    }

    if (realPath.endsWith("/info/refs")) {
      handleInfoRefs(req, res, repoPath);
    } else if (realPath.endsWith("/git-upload-pack")) {
      handleGitUploadPack(req, res, repoPath);
    } else if (realPath.endsWith("/git-receive-pack")) {
      handleGitReceivePack(req, res, repoPath);
    } else {
      console.log(realPath);
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  }
);

// Handle /info/refs endpoint
function handleInfoRefs(
  req: IncomingMessage,
  res: ServerResponse,
  repoPath: string
) {
  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method Not Allowed");
    return;
  }

  const service = new URL(
    req.url!,
    `http://${req.headers.host}`
  ).searchParams.get("service");
  if (!service || !["git-upload-pack", "git-receive-pack"].includes(service)) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Bad Request");
    return;
  }

  res.writeHead(200, {
    "Content-Type": `application/x-${service}-advertisement`,
    "Cache-Control": "no-cache",
  });

  // Execute Git command to generate response
  const gitProcess = spawn("git", [
    service.replace("git-", ""),
    "--stateless-rpc",
    "--advertise-refs",
    repoPath,
  ]);

  // Prefix Git output with required header
  const serviceLine = `# service=${service}\n`;
  const length = (serviceLine.length + 4).toString(16).padStart(4, "0");
  const prefix = `${length}${serviceLine}0000`;
  res.write(prefix);

  gitProcess.stdout.pipe(res);
  gitProcess.stderr.on("data", (data: any) =>
    console.error(`Git error: ${data}`)
  );

  gitProcess.on("close", (code: any) => {
    if (code !== 0) {
      console.error(`Git process exited with code ${code}`);
    }
    res.end();
  });
}

// Handle /git-upload-pack endpoint
function handleGitUploadPack(
  req: IncomingMessage,
  res: ServerResponse,
  repoPath: string
) {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method Not Allowed");
    return;
  }

  res.writeHead(200, {
    "Content-Type": "application/x-git-upload-pack-result",
    "Cache-Control": "no-cache",
  });

  // Execute Git command to handle upload-pack
  const gitProcess = spawn("git", ["upload-pack", "--stateless-rpc", repoPath]);

  // Pipe request body to Git process
  req.pipe(gitProcess.stdin);

  // Pipe Git process output to response
  gitProcess.stdout.pipe(res);

  gitProcess.stderr.on("data", (data: any) =>
    console.error(`Git error: ${data}`)
  );

  gitProcess.on("close", (code: any) => {
    if (code !== 0) {
      console.error(`Git process exited with code ${code}`);
    }
    res.end();
  });
}

function handleGitReceivePack(
  req: IncomingMessage,
  res: ServerResponse,
  repoPath: string
) {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method Not Allowed");
    return;
  }

  res.writeHead(200, {
    "Content-Type": "application/x-git-receive-pack-result",
    "Cache-Control": "no-cache",
  });

  // Execute Git command to handle receive-pack
  const gitProcess = spawn("git", [
    "receive-pack",
    "--stateless-rpc",
    repoPath,
  ]);

  // Pipe request body to Git process
  req.pipe(gitProcess.stdin);

  // Pipe Git process output to response
  gitProcess.stdout.pipe(res);

  gitProcess.stderr.on("data", (data: any) =>
    console.error(`Git error: ${data}`)
  );

  gitProcess.on("close", (code: any) => {
    if (code !== 0) {
      console.error(`Git process exited with code ${code}`);
    }
    res.end();
  });
}

// Start the server
server.listen(PORT, () => {
  console.log(`Git HTTP server running at http://localhost:${PORT}/`);
  console.log(`Serving repositories from: ${GIT_PATH}`);
});

function decodeCredentials(authHeader: string): {
  username: string;
  password: string;
} {
  const base64Credentials = authHeader.split(" ")[1];
  const decoded = Buffer.from(base64Credentials, "base64").toString("utf-8");
  const [username, password] = decoded.split(":");
  return { username, password };
}

async function authenticate(
  req: IncomingMessage,
  res: ServerResponse,
  repoName: string
): Promise<boolean> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.writeHead(401, {
      "WWW-Authenticate": 'Basic realm="Git"',
      "Content-Type": "text/plain",
    });
    res.end("Authentication required");
    return false;
  }

  const { username, password } = decodeCredentials(authHeader);

  const user = await UserModel.findOne({ username });
  if (!user || !user.active) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Invalid credentials");
    return false;
  }

  const sha256 = createHash("sha256").update(password).digest("hex");

  if (user.password !== sha256) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Invalid credentials");
    return false;
  }

  console.log(repoName);

  if (!repoName.startsWith("@" + user.username)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("You dont have access to this repository");
    return false;
  }

  return true;
}
