/**
 * apps/web/src/global/i18n/onlineTranslateV3.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2024
 *
 */

export async function translateOnlineV3(options: {
  text: string;
  to: string;
  from?: string;
}) {
  const body = {
    text: options.text,
    to: options.to,
    from: options.from || "de",
  };

  const res = await fetch("https://translate-cache.ben-siebert.com/translate", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const j = await res.json();

  return j.text;
}
