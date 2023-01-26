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
  const npmPackages = execSync("npm list --depth=0 --json", {
    cwd: root,
  }).toString();

  const getPackage = (pkg) => {
    let packages = [];
    for (let i in pkg.dependencies) {
      packages.push({
        name: i,
        version: pkg.dependencies[i].version,
      });
      if (pkg.dependencies[i].dependencies) {
        packages = packages.concat(getPackage(pkg.dependencies[i]));
      }
    }
    return packages;
  };

  let packages = getPackage(JSON.parse(npmPackages));

  // remove duplicates
  packages = packages.filter(
    (v, i, a) => a.findIndex((t) => t.name === v.name) === i
  );

  for (const p of packages) {
    INFO.packages.packages.push({
      name: p.name,
      version: p.version,
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
