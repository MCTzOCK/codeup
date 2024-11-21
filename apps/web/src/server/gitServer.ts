/**
 * apps/web/src/server/gitServer.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.11.2024
 *
 */
import { createServer } from "http";
import { IncomingMessage, ServerResponse } from "node:http";

const http = require("node:http");
const { spawn } = require("node:child_process");
const { join } = require("node:path");
const { existsSync } = require("node:fs");

const PORT = process.env.GIT_PORT ? parseInt(process.env.GIT_PORT) : 3002;

// Get the base path for Git repositories from the environment variable
const GIT_PATH = process.env.GIT_DATA_HOME;
if (!GIT_PATH) {
  console.error("Error: GIT_DATA_HOME environment variable is not set.");
  process.exit(1);
}

// Utility to resolve repository path
function resolveRepoPath(repoName: string) {
  const repoPath = join(GIT_PATH, repoName);
  if (existsSync(repoPath)) {
    return repoPath;
  }
  return null;
}

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url as string;

    console.log(`Incoming request: ${req.method} ${url}`);

    const urlParts = url.split("/");
    if (urlParts.length < 2) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Repository not found");
      return;
    }

    const repoName = urlParts[1];
    const repoPath = resolveRepoPath(repoName);
    if (!repoPath) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Repository not found");
      return;
    }
    let realPath = url.split("?")[0];

    if (realPath.endsWith("/info/refs")) {
      handleInfoRefs(req, res, repoPath);
    } else if (realPath.endsWith("/git-upload-pack")) {
      handleGitUploadPack(req, res, repoPath);
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
  if (!service || !["git-upload-pack"].includes(service)) {
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
  res.write(`# service=${service}\n`);
  res.write("0000");

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

// Start the server
server.listen(PORT, () => {
  console.log(`Git HTTP server running at http://localhost:${PORT}/`);
  console.log(`Serving repositories from: ${GIT_PATH}`);
});
