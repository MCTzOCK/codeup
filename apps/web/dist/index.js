"use strict";
/**
 * apps/web/src/server/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.12.2022
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
const next_1 = __importDefault(require("next"));
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    (0, http_1.createServer)((req, res) => {
        const parsedUrl = (0, url_1.parse)(req.url, true);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("X-Served-By", "CodeUp");
        handle(req, res, parsedUrl);
    }).listen(port, "0.0.0.0");
    // tslint:disable-next-line:no-console
    console.log(`> Server listening at http://0.0.0.0:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
});
