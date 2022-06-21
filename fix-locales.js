/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 */

const fs = require('fs');
const path = require('path');
const sortJson = require('sort-json');
const translate = require('@vitalets/google-translate-api');
const chalk = require('chalk');

const BASE = "./public/locales";
const LANGUAGE = "en";
const LANGUAGES_TO_FIX = ["de"];

console.log(
    "Fixing Languages: " + chalk.green(LANGUAGES_TO_FIX)
)

const origFiles = fs.readdirSync(path.join(BASE, LANGUAGE));

const origContent = {}

origFiles.forEach(file => {
    origContent[file.split(".")[0]] = JSON.parse(fs.readFileSync(path.join(BASE, LANGUAGE, file)));
});

console.log(
    "Original (" + LANGUAGE + ") files: " + chalk.green(origFiles)
);

(async () => {
    for (const l of LANGUAGES_TO_FIX) {
        console.log(
            "Fixing Language: " + chalk.yellow(l) + "..."
        )

        const lContent = {}

        if(!fs.existsSync(path.join(BASE, l))) {
            fs.mkdirSync(path.join(BASE, l))
        }

        origFiles.forEach(file => {
            if(!fs.existsSync(path.join(BASE, l, file))) {
                fs.writeFileSync(path.join(BASE, l, file), JSON.stringify({}, null, 2))
            }

            lContent[file.split(".")[0]] = JSON.parse(fs.readFileSync(path.join(BASE, l, file)));
        })

        for (const origKey of Object.keys(origContent)) {
            for (const origNKey of Object.keys(origContent[origKey])) {
                if(!lContent[origKey][origNKey]) {
                    console.log(
                        "Language key (" + chalk.red(origNKey) + ") in " + chalk.red(origKey + ".json") +
                        " not found in language " + chalk.yellow(l) + " -> " + chalk.green("translating") + "..."
                    )
                    lContent[origKey][origNKey] = (await translate(origContent[origKey][origNKey], {from: LANGUAGE, to: l})).text;
                }
            }
            const lContentSorted = sortJson(lContent[origKey], {
                ignoreCase: true,
                reverse: false,
                depth: 1
            })
            const origContentSorted = sortJson(origContent[origKey], {
                ignoreCase: true,
                reverse: false,
                depth: 1
            })
            fs.writeFileSync(
                path.join(BASE, l, origKey + ".json"),
                JSON.stringify(lContentSorted, null, 2)
            )
            // reformatting
            fs.writeFileSync(
                path.join(BASE, LANGUAGE, origKey + ".json"),
                JSON.stringify(origContentSorted, null, 2)
            );

            console.log(
                chalk.blueBright("Fixed " + chalk.red(origKey) + " in language " + chalk.red(l) + "!")
            )
        }
    }
})();
