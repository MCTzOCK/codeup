/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 */

const fs = require("fs");
const path = require("path");
const byteSize = require("byte-size");

let paths = getAllPaths(".", []);

paths = paths
  .filter((p) => !p.includes("node_modules"))
  .filter((p) => !p.includes(".next"))
  .filter((p) => !p.includes(".turbo"))
  .filter((p) => !p.includes(".git"))
  .filter((p) => !p.includes(".idea"))
  .filter((p) => !p.includes(".lock"))
  .filter((p) => !p.includes("LICENSE"))
  .filter((p) => !p.includes(".ico"))
  .filter((p) => !p.includes(".afdesign"));

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

console.log("Total Lines of Code: " + lines);
console.log("Total Source Files: " + paths.length);
console.log("Total Source Size: " + byteSize(size));
filesWithLines.sort((a, b) => b.lines - a.lines);
console.log("Top Biggest Files:");
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
