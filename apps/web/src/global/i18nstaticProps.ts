/**
 * apps/web/src/global/i18nstaticProps.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.07.2024
 *
 */
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const sProp = async (locale: string, ns: string[]) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "de", [
        "base",
        "navbar",
        "footer",
        "popupmanager",
        "auth",
        "snippets-viewer",
        ...ns,
      ])),
    },
  };
};
