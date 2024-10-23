/**
 * packages/observability-reporter/rollup.config.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.10.2024
 *
 */
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js",
  output: {
    file: "dist/codeup-observability.js",
    format: "umd",
    name: "CodeUp Observability",
  },
  plugins: [resolve(), commonjs()],
};
