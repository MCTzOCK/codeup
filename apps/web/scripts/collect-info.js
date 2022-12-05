/**
 * apps/web/build/collect-package-info.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.12.2022
 *
 */

console.log("> Collecting package info...");

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

const INFO = {
  git: {
    commits: 0,
    commit: "",
    branch: "",
  },
  packages: {
    count: 0,
    packages: [],
  },
  app: {
    totalLines: 0,
  },
};

const root = path.join(__dirname, "..");

const getGitInfo = () => {
  const cwd = process.cwd();

  const gitCommit = execSync("git rev-parse --short HEAD", { cwd }).toString();
  const gitCommits = execSync("git rev-list --count HEAD", { cwd }).toString();
  const gitBranch = execSync("git rev-parse --abbrev-ref HEAD", {
    cwd,
  }).toString();

  INFO.git.commits = parseInt(gitCommits.replace("\n", ""));
  INFO.git.commit = gitCommit.replace("\n", "");
  INFO.git.branch = gitBranch.replace("\n", "");
};

const getPackageInfo = () => {
  const npmPackages = execSync("yarn list --depth=0", {
    cwd: root,
  }).toString();

  const packages = npmPackages.split("\n");

  for (const p of packages) {
    const name = p.split("@")[0].replace("├─ ", "").replace("└─ ", "");
    const version = p.split("@")[1];
    if (name.toLowerCase().startsWith("done in")) {
      return;
    }

    INFO.packages.packages.push({
      name,
      version,
    });

    INFO.packages.count++;
  }
};

const getAppInfo = () => {
  const lines = execSync("node sloc --codeup-stats-only-lines-raw", {
    cwd: path.join(__dirname, "..", "..", ".."),
  });

  INFO.app.totalLines = parseInt(lines.toString().replace("\n", ""));
};

getGitInfo();
getPackageInfo();
getAppInfo();

fs.writeFileSync(
  path.join(__dirname, "..", ".codeup_app_stats.json"),
  JSON.stringify(INFO, null, 2)
);

console.log("> Collecting package info... Done!");
