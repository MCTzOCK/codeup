/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 */

const fs = require("fs");
const path = require("path");

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

for (let i = 0; i < paths.length; i++) {
  lines += getFileLines(paths[i]);
}

console.log("Total Lines of Code: " + lines);
console.log("Total Source Files: " + paths.length);

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
  return fs.readFileSync(p).toString().split("\n").length;
}
