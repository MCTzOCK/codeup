/**
 * apps/web/src/server/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.12.2022
 *
 */

import { createServer } from "http";
import { parse } from "url";
import * as next from "next";
import fs from "fs";
import path from "path";
import IDEProjectModel from "@codeup/util/dist/models/IDEProjectModel";
import EditorProjectPageModel from "@codeup/util/dist/models/EditorProjectPageModel";
import mongoose from "mongoose";
import * as ts from "typescript";
import * as sass from "sass";
import * as InCode from "@codeup/incode-compiler/dist";
import { lookup as mimeLookup } from "mime-types";
import formidable from "formidable";
import { randomBytes } from "crypto";
import { createSocketServer } from "./socket";
import EditorProjectModel from "@codeup/util/dist/models/EditorProjectModel";
import EditorProjectFunctionModel from "@codeup/util/dist/models/EditorProjectFunctionModel";
import Docker from "dockerode";
import jwt from "jsonwebtoken";
import EditorProjectKVStorageModel from "@codeup/util/dist/models/EditorProjectKVStorageModel";
import ShortURLModel from "@codeup/util/dist/models/ShortURLModel";
import ErrorModel from "@codeup/util/src/models/ErrorModel";
import { PostHog } from "posthog-node";
import Stripe from "stripe";
import { isLoggedIn } from "../global/server/isLoggedIn";
import { getS3 } from "../global/getS3";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import UserModel from "@codeup/util/dist/models/UserModel";

const app = next.default({
  dev: process.env.NODE_ENV === "development",
});
const handle = app.getRequestHandler();

if (process.env.DISABLE_PAYMENTS === "true") {
  // @ts-ignore
  process.env.DISABLE_PAYMENTS = true;
}
app
  .prepare()
  .then(async () => {
    const port = parseInt(process.env.PORT || "3000", 10);
    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(process.env.MONGO_URI as string);
      } catch (e) {
        console.error("Could not connect to MongoDB");
        console.error(e);
        process.exit(1);
      }
    }

    const mediaBucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      {
        bucketName: "media",
      }
    );

    process.on("uncaughtException", async (e) => {
      await handleError(e);
    });

    const docker = new Docker();

    docker
      .pull("mctzock/codeup-serverless-runtime")
      .then((stream) => {
        docker.modem.followProgress(stream, (err: any, res: any) => {
          console.log(err, res);
        });
      })
      .catch(async (e) => {
        await handleError(e);
      });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2022-11-15",
    });

    const httpServer = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url!, true);

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("X-Served-By", "CodeUp");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

        const { pathname } = parsedUrl;

        const customDomain = req.headers.host!.includes(":")
          ? req.headers.host!.split(":")[0]
          : req.headers.host;

        if (customDomain!.split(".").length > 2) {
          const project = await EditorProjectModel.findOne({
            customDomain,
          });

          if (!project) {
            await handle(req, res);
            return;
          }
          if (pathname!.startsWith("/api")) {
            // check if pathname is /api/@codeup/internal/info

            if (pathname!.startsWith("/api/@codeup")) {
              const pathParts = pathname!.split("/").slice(3);
              if (pathParts.length === 2) {
                if (pathParts[0] === "database") {
                  if (pathParts[1] === "set") {
                    const key = req.headers["x-codeup-database-key"] as string;
                    const token = req.headers["x-sf-access"] as string;
                    const value = JSON.parse(
                      await new Promise((resolve, reject) => {
                        let body = "";
                        req.on("data", (chunk) => {
                          body += chunk;
                        });
                        req.on("end", () => {
                          resolve(body);
                        });
                        req.on("error", (e) => {
                          reject(e);
                        });
                      })
                    ).value as string;

                    if (!key || !token || !value) {
                      res.statusCode = 400;
                      res.write(
                        JSON.stringify({
                          key: JSON.stringify(key),
                          token: JSON.stringify(token),
                          value: JSON.stringify(value),
                        })
                      );
                      res.end();
                      return;
                    }

                    try {
                      const decoded = jwt.verify(
                        token,
                        process.env.JWT_SECRET as string
                      ) as { project: string; function: string };

                      if (decoded.project !== project._id.toString()) {
                        res.statusCode = 403;
                        res.end();
                        return;
                      }

                      const existingKVStore =
                        await EditorProjectKVStorageModel.findOne({
                          project: project._id,
                        });

                      console.log(
                        "[SFDB] Set",
                        key,
                        "to",
                        value,
                        "for",
                        project._id.toString()
                      );

                      if (existingKVStore) {
                        existingKVStore.storage = {
                          ...existingKVStore.storage,
                          [key]: value,
                        };
                        await existingKVStore.save();
                      } else {
                        await EditorProjectKVStorageModel.create({
                          project: project._id,
                          storage: {
                            [key]: value,
                          },
                        });
                      }

                      res.statusCode = 200;
                      res.end();
                    } catch (e) {
                      res.statusCode = 403;
                      res.end();
                      return;
                    }
                  } else if (pathParts[1] === "get") {
                    const key = req.headers["x-codeup-database-key"] as string;
                    const token = req.headers["x-sf-access"] as string;

                    if (!key || !token) {
                      res.statusCode = 400;
                      res.end();
                      return;
                    }

                    try {
                      const decoded = jwt.verify(
                        token,
                        process.env.JWT_SECRET as string
                      ) as { project: string; function: string };

                      if (decoded.project !== project._id.toString()) {
                        res.statusCode = 403;
                        res.end();
                        return;
                      }

                      const existingKVStore =
                        await EditorProjectKVStorageModel.findOne({
                          project: project._id,
                        });

                      if (existingKVStore) {
                        res.statusCode = 200;
                        res.end(existingKVStore.storage[key]);
                      } else {
                        res.statusCode = 404;
                        res.end();
                      }
                    } catch (e) {
                      res.statusCode = 403;
                      res.end();
                      return;
                    }
                  }
                }
              }

              return;
            } else {
              const serverlessFunction =
                await EditorProjectFunctionModel.findOne({
                  project: project._id,
                  path: pathname!,
                });

              if (!serverlessFunction) {
                res.statusCode = 404;
                res.end("Not Found");
                return;
              }

              const code = serverlessFunction.code;

              let port = Math.floor(Math.random() * 32000) + 1;

              docker
                .createContainer({
                  Image: "rce-sf-runtime:codeup",
                  Env: [
                    "SERVERLESS_METHOD=GET",
                    "SERVERLESS_ENDPOINT=/",
                    "SERVERLESS_CODE=" + code,
                    "SERVERLESS_TOKEN=" +
                      jwt.sign(
                        {
                          project: project._id,
                          function: serverlessFunction._id,
                        },
                        process.env.JWT_SECRET as string,
                        {
                          expiresIn: 600,
                        }
                      ),
                    "SERVERLESS_ENDPOINT_URL=http://" + customDomain,
                  ],
                  HostConfig: {
                    PortBindings: {
                      "3000/tcp": [
                        {
                          HostPort: port.toString(),
                        },
                      ],
                    },
                  },
                  Tty: true,
                  OpenStdin: true,
                  StdinOnce: true,
                  AttachStdin: true,
                  AttachStdout: true,
                  AttachStderr: true,
                  ExposedPorts: {
                    "3000/tcp": {},
                  },
                })
                .then(async (c) => {
                  await c.start();

                  await new Promise((resolve, reject) => {
                    setTimeout(() => {
                      resolve(true);
                    }, 1000);
                  });

                  const query = Object.keys(parsedUrl.query).map((key) => {
                    return key + "=" + parsedUrl.query[key];
                  });

                  try {
                    const res0 = await fetch(
                      `http://localhost:${port}?${
                        query.length > 0 ? query.join("&") : ""
                      }`
                    );

                    for (const [key, value] of res0.headers.entries()) {
                      res.setHeader(key, value);
                    }

                    res.writeHead(res0.status, {
                      ...res.getHeaders(),
                    });

                    res.end(await res0.text());

                    await new Promise((resolve, reject) => {
                      setTimeout(() => {
                        resolve(true);
                      }, 1000);
                    });

                    try {
                      await c.kill();
                    } catch (e) {}
                    await c.remove();
                  } catch (e) {
                    res.statusCode = 500;
                    res.end(
                      "[SF] Serverless function failed to execute properly. Error details: " +
                        (e as any).toString()
                    );

                    try {
                      await c.kill();
                    } catch (e) {}
                    await c.remove();
                  }
                })
                .catch((e) => {
                  console.error(e);
                  res.statusCode = 500;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify(e, null, 2));
                });

              return;
            }
          }

          const page = await EditorProjectPageModel.findOne({
            project: project._id,
            url: pathname,
          });

          if (!page) {
            await handle(req, res);
            return;
          }

          res.setHeader("Content-Type", "text/html");

          let resourceEmbedCode = "";

          for (const resource of page.resources) {
            switch (resource.type.toLowerCase()) {
              case "css":
                resourceEmbedCode += `<style>${resource.content}</style>`;
                break;
              case "scss":
                resourceEmbedCode += `<style>${
                  sass.compileString(resource.content, {
                    syntax: "scss",
                  }).css
                }</style>`;
                break;
              case "sass":
                resourceEmbedCode += `<style>${
                  sass.compileString(resource.content, {
                    syntax: "indented",
                  }).css
                }</style>`;
                break;
              case "javascript":
                resourceEmbedCode += `<script defer>${resource.content}</script>`;
                break;
              case "typescript":
                resourceEmbedCode += `<script defer>${
                  ts.transpileModule(resource.content, {
                    compilerOptions: {
                      module: ts.ModuleKind.ESNext,
                    },
                  }).outputText
                }</script>`;
                break;
              default:
                break;
            }
          }

          if (page.type.toLowerCase() === "html") {
            res.statusCode = 200;
            res.write((page.mainContent += resourceEmbedCode));
            res.end();
          } else if (page.type.toLowerCase() === "incode") {
            res.statusCode = 200;
            res.write(
              `<html><head><title>${
                page.url
              }</title></head><body><script defer>${InCode.Compiler.compile(
                page.mainContent
              )}</script></body></html>${resourceEmbedCode}`
            );
            res.end();
          }
        } else {
          if (pathname === "/_internal/api/app/stats") {
            if (process.env.NODE_ENV === "production") {
              if (
                fs.existsSync(
                  path.join(__dirname, "..", "..", ".codeup_app_stats.json")
                )
              ) {
                res.setHeader("Content-Type", "application/json");
                res.end(
                  fs
                    .readFileSync(
                      path.join(__dirname, "..", "..", ".codeup_app_stats.json")
                    )
                    .toString()
                );
              } else {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    status: "failed",
                    message: "This endpoint is currently not available.",
                  })
                );
              }
            } else {
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  status: "failed",
                  message:
                    "This endpoint is only available in production mode.",
                })
              );
            }

            return;
          }

          const shortUrl = await ShortURLModel.findOne({
            short: pathname!.startsWith("/") ? pathname!.slice(1) : pathname,
          });

          if (shortUrl) {
            res.writeHead(302, {
              Location: shortUrl.destination,
            });

            res.end();

            return;
          }

          if (
            pathname?.startsWith("/project") &&
            !pathname?.startsWith("/projects")
          ) {
            // URL Structure : /project/:customName/:path

            const customName = pathname.split("/")[2];
            let path = pathname.split("/").slice(3).join("/");

            try {
              const project = await IDEProjectModel.findOne({
                publishedCustomName: customName,
              });

              if (!project) {
                throw new Error();
                return;
              }

              if (!project.published) {
                throw new Error();
                return;
              }

              let file = project.files.find(
                (f: { path: string }) =>
                  f.path.toLowerCase() === `/${path.toLowerCase()}`
              );

              if (!file) {
                // redirect to index.html
                res.writeHead(302, {
                  Location: `/project/${customName}/index.html`,
                });

                res.end();

                return;
              }

              let ret = file.content;

              if (file.path.toLowerCase().endsWith(".ts")) {
                ret = ts.transpileModule(ret, {
                  compilerOptions: {
                    module: ts.ModuleKind.ESNext,
                  },
                }).outputText;
              }

              if (
                file.path.toLowerCase().endsWith(".scss") ||
                file.path.toLowerCase().endsWith(".sass")
              ) {
                ret = sass.compileString(file.content, {
                  syntax: file.path.toLowerCase().endsWith(".scss")
                    ? "scss"
                    : "indented",
                }).css;
              }

              if (file.path.toLowerCase().endsWith(".ic")) {
                ret = `<html><head><title>${
                  file.path
                }</title></head><body><script defer>${InCode.Compiler.compile(
                  ret
                )}</script></body></html>`;
              }

              const mimeTypes: { [key: string]: string } = {
                js: "application/javascript",
                css: "text/css",
                html: "text/html",
                json: "application/json",
                png: "image/png",
                jpg: "image/jpeg",
                jpeg: "image/jpeg",
                gif: "image/gif",
                svg: "image/svg+xml",
                ic: "text/html",
              };
              const replaceTypes: { [key: string]: string } = {
                "text/x-scss": "text/css",
                "text/x-sass": "text/css",
                "text/x-typescript": "application/javascript",
              };

              let mimeType = "";

              if (mimeTypes[file.path.split(".").pop() as string]) {
                mimeType = mimeTypes[file.path.split(".").pop() as string];
              } else {
                mimeType = mimeLookup(file.path) as string;
              }

              if (!mimeType || !Object.values(mimeTypes).includes(mimeType)) {
                if (mimeType && Object.keys(replaceTypes).includes(mimeType)) {
                  mimeType = replaceTypes[mimeType];
                } else {
                  mimeType = "text/plain";
                }
              }

              res.setHeader("Content-Type", mimeType);

              res.end(ret);

              return;
            } catch (e) {
              console.log(e);
              await app.render404(req, res, parsedUrl);
              return;
            }
          }

          if (pathname?.startsWith("/media")) {
            if (pathname?.includes("/upload")) {
              if (req.method === "POST") {
                const form = new formidable.IncomingForm();

                await new Promise((resolve, reject) => {
                  form.parse(req, async (err, fields, files) => {
                    if (err) {
                      await app.render404(req, res, parsedUrl);
                      console.log(err);
                      return;
                    }

                    const file = files.file as formidable.File;

                    if (!file) {
                      await app.render404(req, res, parsedUrl);
                      return;
                    }

                    const content = fs.readFileSync(file.filepath);
                    const mimeType = file.mimetype;
                    const fileName = file.originalFilename;

                    const uploadStream = mediaBucket.openUploadStream(
                      randomBytes(128).toString("hex") +
                        "." +
                        (fileName as string).split(".").pop(),
                      {
                        contentType: mimeType as string,
                        metadata: {
                          contentType: mimeType as string,
                          fileName: fileName as string,
                        },
                      }
                    );

                    uploadStream.write(content);

                    uploadStream.end();

                    await new Promise((resolve0) => {
                      uploadStream.on("finish", () => {
                        resolve0(true);
                      });
                    });

                    res.end(
                      JSON.stringify({
                        status: "success",
                        message: "File uploaded successfully.",
                        data: {
                          url: `/media/${uploadStream.filename}`,
                        },
                      })
                    );

                    resolve(true);
                  });
                });
                return;
              } else {
                await app.render404(req, res, parsedUrl);
                return;
              }
            } else {
              // URL Structure : /media/:filename

              const filename =
                pathname.split("/")[pathname.split("/").length - 1];

              const file = await mediaBucket.openDownloadStreamByName(filename);

              if (!file) {
                await app.render404(req, res, parsedUrl);
                return;
              }

              const arr = await mediaBucket.find({ filename }).toArray();

              const gfsFile = arr[0] as typeof arr[0] & {
                metadata: { contentType: string };
              };

              res.setHeader("Content-Type", gfsFile.metadata.contentType);

              await new Promise((resolve) => {
                file.on("data", (chunk) => {
                  res.write(chunk);
                });
                file.on("end", () => {
                  res.end();
                  resolve(true);
                });
              });

              return;
            }
          }

          if (pathname?.startsWith("/editor-static")) {
            // Option 1: /editor-static/page-res/<page_id>/<res_name>
            // Option 2: /editor-static/<project_id>/<res_id>

            const args = pathname
              ?.split("/")
              .splice(2, pathname?.split("/").length);

            if (args.length === 3) {
              const pageId = args[1];
              const resName = args[2];

              const page = await EditorProjectPageModel.findById(pageId);

              if (!page) {
                await app.render404(req, res);
                return;
              }

              const resource = page.resources.find(
                (r: any) => r.name === resName
              );
              if (!resource) {
                await app.render404(req, res);
                return;
              }

              let content = resource.content;

              switch (resource.type.toLowerCase()) {
                case "css":
                  res.setHeader("Content-Type", "text/css");
                  break;
                case "scss":
                  content = sass.compileString(content, {
                    syntax: "scss",
                  }).css;
                  res.setHeader("Content-Type", "text/css");
                  break;
                case "sass":
                  content = sass.compileString(content, {
                    syntax: "indented",
                  }).css;
                  res.setHeader("Content-Type", "text/css");
                  break;
                case "javascript":
                  res.setHeader("Content-Type", "text/javascript");
                  break;
                case "typescript":
                  content = ts.transpileModule(content, {
                    compilerOptions: {
                      module: ts.ModuleKind.ESNext,
                    },
                  }).outputText;
                  res.setHeader("Content-Type", "text/javascript");
                  break;
                case "json":
                  res.setHeader("Content-Type", "application/json");
                  break;
                default:
                  res.setHeader("Content-Type", "text/plain");
                  break;
              }

              res.write(content.toString());
              res.end();
            } else {
              const projectId = args[0];
              const resName = args[1];

              const bucket = new mongoose.mongo.GridFSBucket(
                mongoose.connection.db,
                {
                  bucketName: "editorStaticAssets",
                }
              );

              const file = await bucket.find({
                filename: `${projectId}/${resName}`,
              });

              const fileEntry = await file.next();

              if (file) {
                const stream = bucket.openDownloadStream(fileEntry!._id);

                await new Promise((resolve) => {
                  stream.on("data", async (chunk) => {
                    res.write(chunk);
                  });
                  stream.on("end", () => {
                    res.end();
                    resolve(true);
                  });
                });
              } else {
                await app.render404(req, res);
                return;
              }
            }
          }

          if (pathname?.startsWith("/editor-preview")) {
            // /editor-preview/<page_id>

            const args = pathname
              ?.split("/")
              .splice(2, pathname?.split("/").length);

            const pageId = args[0];

            const page = await EditorProjectPageModel.findById(pageId);

            if (!page) {
              await app.render404(req, res);
              return;
            }

            let resourceEmbedCode = ``;

            for (const resource of page.resources) {
              switch (resource.type.toLowerCase()) {
                case "css":
                  resourceEmbedCode += `<style>${resource.content}</style>`;
                  break;
                case "scss":
                  resourceEmbedCode += `<style>${
                    sass.compileString(resource.content, {
                      syntax: "scss",
                    }).css
                  }</style>`;
                  break;
                case "sass":
                  resourceEmbedCode += `<style>${
                    sass.compileString(resource.content, {
                      syntax: "indented",
                    }).css
                  }</style>`;
                  break;
                case "javascript":
                  resourceEmbedCode += `<script defer>${resource.content}</script>`;
                  break;
                case "typescript":
                  resourceEmbedCode += `<script defer>${
                    ts.transpileModule(resource.content, {
                      compilerOptions: {
                        module: ts.ModuleKind.ESNext,
                      },
                    }).outputText
                  }</script>`;
                  break;
                default:
                  break;
              }
            }

            if (page.type.toLowerCase() === "html") {
              res.statusCode = 200;
              res.write(page.mainContent);
              res.write(resourceEmbedCode);
              res.end();
            } else if (page.type.toLowerCase() === "incode") {
              res.statusCode = 200;
              res.write(
                `<html><head><title>${
                  page.url
                }</title>${resourceEmbedCode}</head><body><script defer>${InCode.Compiler.compile(
                  page.mainContent
                )}</script></body></html>`
              );
              res.end();
            }
          }

          await handle(req, res, parsedUrl);
        }
      } catch (e) {
        await handleError(e);
        await app.renderError(e as any, req, res, req.url!);
      }
    });

    createSocketServer(httpServer);

    httpServer.listen(port, "0.0.0.0", 10, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(async (e) => {
    handleError(e);
    console.error(e);
    process.exit(1);
  });

const handleError = async (e: any) => {
  const err = {
    name: "Unknown Error",
    message: "No message provided",
    stack: "No stack provided",
  };

  if (e.name) err.name = e.name;
  if (e.message) err.message = e.message;
  if (e.stack) err.stack = e.stack;
  await ErrorModel.create(err);
};
