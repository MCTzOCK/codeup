/**
 * src/util/userworkflow/redirect.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import { decode } from "jsonwebtoken";

export default function redirect(options: {
  redirectToLogin?: boolean;
  redirectTo?: string;
  allowAnonymous?: boolean;
  forceAnonymous?: boolean;
}) {
  if (localStorage.getItem("token") !== null) {
    const token = localStorage.getItem("token") as string;
    try {
      const decoded = decode(token);
      if (decoded === null) {
        throw new Error("Token could not be decoded");
      }
      if (options.forceAnonymous) {
        window.location.href = options.redirectTo as string | "/dashboard";
      }
    } catch (e) {
      localStorage.removeItem("token");
      if (!options.allowAnonymous) {
        if (options.redirectToLogin) {
          window.location.href = `/account/login${
            options.redirectTo ? `?redirect=${options.redirectTo}` : ""
          }`;
        }
      }
    }
  } else {
    if (!options.allowAnonymous) {
      if (options.redirectToLogin) {
        window.location.href = `/account/login${
          options.redirectTo ? `?redirect=${options.redirectTo}` : ""
        }`;
      }
    }
  }
}
