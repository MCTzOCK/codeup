/**
 * apps/web/next-i18next.config.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.2024
 *
 */

/** @type {import("next-i18next").UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "de",
    locales: ["de", "en"],
  },
  defaultNS: "base",
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
