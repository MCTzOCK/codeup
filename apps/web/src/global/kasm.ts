/**
 * apps/web/src/global/kasm.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.11.2024
 *
 */

export default class Kasm {
  private api_key: string = "";
  private api_secret: string = "";
  private api_url: string = "https://api.kasmweb.com";

  public static instance: Kasm;

  public static getKasm(): Kasm {
    return new Kasm(
      process.env.KASM_API_KEY as string,
      process.env.KASM_API_SECRET as string,
      process.env.KASM_URL as string
    );
  }

  constructor(api_key: string, api_secret: string, api_url: string) {
    this.api_key = api_key;
    this.api_secret = api_secret;
    this.api_url = api_url;
    Kasm.instance = this;
  }

  public static getInstance(): Kasm {
    return Kasm.instance;
  }

  public makeAuthenticatedCall(
    path: string,
    method: string,
    body: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(this.api_url + path, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...body,
          api_key: this.api_key,
          api_key_secret: this.api_secret,
        }),
      }).then((res) => {
        res
          .json()
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }
}
