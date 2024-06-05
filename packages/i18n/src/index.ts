/**
 * packages/i18n/src/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2024
 *
 */

export class CodeUpI18n {
  private readonly projectId: string;
  private language: string;

  constructor(projectId: string, language: string) {
    this.projectId = projectId;
    this.language = language;
  }

  setLanguage(language: string) {
    this.language = language;
  }

  async getTranslation(key: string, language?: string) {
    const res = await fetch(
      `http://127.0.0.1/api/projects/${
        this.projectId
      }/i18n/getTranslation?key=${key}&language=${language || this.language}`
    );
    const j = await res.json();
    return j.translation;
  }

  async translateOnlineV3(text: string, to: string, from?: string) {
    const body = {
      text,
      to,
      from: from || "de",
    };

    const res = await fetch(
      "https://translate-cache.ben-siebert.com/translate",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const j = await res.json();

    return j.text;
  }
}
