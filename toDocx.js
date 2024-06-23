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
const docx = require("docx");

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

const sections = [
  {
    children: [
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Inhaltsverzeichnis",
            font: "Arial",
          }),
        ],
        heading: docx.HeadingLevel.TITLE,
      }),
      new docx.TableOfContents("Inhaltsverzeichnis", {
        hyperlink: true,
      }),
    ],
  },
];

for (let file of paths) {
  file = file.replace(path.join(__dirname, "/"), "");
  file = file.replace(/\\/g, "/");
  console.log(`Reading ${file}`);
  let content = fs.readFileSync(file, "utf8");
  /*content = removeEmojis(content);
  content = content.replace("[", "\\verb|[|");
  content = content.replace("]", "\\verb|]|");*/

  let trLines = content.split("\n").map((line) => {
    return new docx.Paragraph({
      children: [
        new docx.TextRun({
          text: line,
          font: "Arial",
        }),
      ],
    });
  });

  const section = {
    properties: {
      type: docx.SectionType.CONTINUOUS,
    },
    children: [
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: file,
            font: "Arial",
          }),
        ],
        heading: docx.HeadingLevel.HEADING_2,
      }),
      ...trLines,
    ],
  };

  sections.push(section);
}

const doc = new docx.Document({
  features: {
    updateFields: true,
  },
  creator: "Ben Siebert",
  description: "CodeUp Quellcode",
  title: "CodeUp Quellcode",
  sections,
});

docx.Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(path.join(__dirname, "codeup.docx"), buffer);
});
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
