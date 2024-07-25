/**
 * apps/web/translate.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.07.2024
 *
 */

const BASE_LANG = "de";
const fs = require("fs");
const path = require("path");

const baseLanguage = {};

const languages = fs
  .readdirSync(path.join(__dirname, "public", "locales"))
  .filter((l) => l !== BASE_LANG);

const baseFiles = fs.readdirSync(
  path.join(__dirname, "public", "locales", BASE_LANG)
);

for (const f of baseFiles) {
  const data = fs.readFileSync(
    path.join(__dirname, "public", "locales", BASE_LANG, f)
  );
  baseLanguage[f] = JSON.parse(data.toString());
}

(async () => {
  for await (const l of languages) {
    console.log("Translating language " + l + "...");
    const files = fs.readdirSync(path.join(__dirname, "public", "locales", l));
    for await (const f of files) {
      if (!baseLanguage[f]) {
        console.log("File " + f + " not found in base language");
        continue;
      }

      console.log("Translating file " + f + "...");

      const data = fs.readFileSync(
        path.join(__dirname, "public", "locales", l, f)
      );

      const parsed = JSON.parse(data.toString());

      for await (const key of Object.keys(baseLanguage[f])) {
        if (!parsed[key]) {
          console.log("Translating key " + key + "...");
          const translated = await translate(baseLanguage[f][key], l);
          parsed[key] = translated;
        }
      }

      fs.writeFileSync(
        path.join(__dirname, "public", "locales", l, f),
        JSON.stringify(parsed, null, 2)
      );
    }
  }
})();

async function translate(text, to) {
  const res = await fetch("https://translate-cache.ben-siebert.com/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      to: to,
    }),
  });

  if (res.status !== 200) {
    return text;
  }

  const data = await res.json();

  return data.text;
}
