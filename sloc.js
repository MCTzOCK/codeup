/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 */

const fs = require("fs");
const path = require("path");
const byteSize = require("byte-size");

let paths = getAllPaths(".", []);

const disallowed = [
  ".turbo",
  ".git",
  ".idea",
  ".ico",
  ".jpg",
  ".png",
  ".docusaurus",
  ".ttf",
  ".afdesign",
  "LICENSE",
  ".lock",
  "package-lock.json",
  ".log",
  "node_modules",
  ".next",
  "dist",
];

// filter disallowed files
paths = paths.filter((p) => {
  let allowed = true;
  disallowed.forEach((d) => {
    if (p.toLowerCase().includes(d.toLowerCase())) {
      allowed = false;
    }
  });
  return allowed;
});

let lines = 0;
let size = 0;

let filesWithLines = [];

for (let i = 0; i < paths.length; i++) {
  let fLines = getFileLines(paths[i]);
  filesWithLines.push({
    path: paths[i],
    lines: fLines,
  });
  lines += fLines;
}

if (process.argv.includes("-v")) {
  console.log(JSON.stringify(paths, null, 2));
}

console.warn("\u001b[31mProject Statistics\u001b[0m");
console.table({
  "Total Lines": lines,
  "Total Files": paths.length,
  "Total Size": byteSize(size).value + " " + byteSize(size).unit,
  "Total Characters": size,
});

console.log("\n");

console.warn("\u001b[31mBigest Files\u001b[0m");
filesWithLines.sort((a, b) => b.lines - a.lines);
filesWithLines.slice(0, 10).forEach((f, i) => {
  console.log(i + 1 + ". " + f.path + ": " + f.lines);
});

if (process.argv.includes("--list-all")) {
  filesWithLines.slice(10, filesWithLines.length).forEach((f, i) => {
    console.log(i + 11 + ". " + f.path + ": " + f.lines);
  });
}

function getAllPaths(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllPaths(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

function getFileLines(p) {
  let file = fs.readFileSync(p, "utf8");
  size += file.toString().length;
  return file.toString().split("\n").length;
}
