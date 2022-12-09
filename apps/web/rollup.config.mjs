import * as path from 'path';
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import {nodeResolve} from "@rollup/plugin-node-resolve";
import nodePolyfills from "rollup-plugin-polyfill-node";

export default {
  input: "server-build/index.js",
  output: {
    name: "server",
    file: "server-build/bundle.js",
    format: "iife"
  },
  plugins: [json(), commonjs(), nodeResolve({
    browser: false,
    exportConditions: ["default", "module", "import", "require"]
  }),
    nodePolyfills()
  ],
};
