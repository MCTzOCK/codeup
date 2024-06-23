/**
 * /toLatex.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.06.2024
 *
 */

const fs = require("fs");
const path = require("path");
const byteSize = require("byte-size");

const ignore = [
  ".turbo",
  ".git",
  ".idea",
  ".ico",
  ".jpg",
  ".jpeg",
  ".png",
  ".docusaurus",
  ".ttf",
  ".zip",
  ".afdesign",
  "LICENSE",
  ".lock",
  "package-lock.json",
  ".log",
  "node_modules",
  ".next",
  "dist",
  "build",
  ".codeup_app_stats.json",
  ".react-email",
  ".env",
  ".env.web",
  "pdf",
  "docs",
  "svg",
  "codeup.tex",
  ".woff2",
  "toMarkdown.js",
];

let paths = getAllPaths(".", []);

paths = paths.filter((p) => {
  let allowed = true;
  ignore.forEach((d) => {
    if (p.toLowerCase().includes(d.toLowerCase())) {
      allowed = false;
    }
  });
  return allowed;
});

let title = `# CodeUp Quellcode 
 **Author:** Ben Siebert
 **Generated At:** ${new Date().toLocaleString()}`;
let toc = `
# Inhaltsverzeichnis \n
`;
let markdown = ``;

for (let file of paths) {
  file = file.replace(path.join(__dirname, "/"), "");
  file = file.replace(/\\/g, "/");
  console.log(`Reading ${file}`);
  let content = fs.readFileSync(file, "utf8");
  /*content = removeEmojis(content);
  content = content.replace("[", "\\verb|[|");
  content = content.replace("]", "\\verb|]|");*/

  toc += `* [${file}](#${file}) - (${byteSize(content.length).toString()})\n`;

  markdown += `## ${file} \n\n\`\`\`\n${content}\`\`\`\n\n\n`;
}

//markdown = markdown.replace(/\\/g, "\\\\");
markdown = markdown.replace(/[^\x00-\x7F]/g, ""); // remove non-ascii characters

fs.writeFileSync(
  path.join(__dirname, "codeup.MD"),
  `
${title}
${toc}
${markdown}
  `
);

console.log("Done!");

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
