/**
 * packages/util/src/AccountManager.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.03.23
 *
 */
import REST from "@codeup/rest/dist";

export type Account = {
  username: string;
  token: string;
  email: string;
  firstName: string;
  lastName: string;
};

export default class AccountManager {
  public static readonly LS_KEY = "codeup.accounts";

  public static getAccounts(): Account[] {
    try {
      if (
        localStorage.getItem(AccountManager.LS_KEY) === null ||
        localStorage.getItem(AccountManager.LS_KEY) === undefined
      ) {
        localStorage.setItem(AccountManager.LS_KEY, JSON.stringify([]));
      }

      const accs = JSON.parse(
        localStorage.getItem(AccountManager.LS_KEY) as string
      );

      if (accs === null || accs === undefined) {
        return [];
      }

      return accs;
    } catch (e) {
      return [];
    }
  }

  public static async addAccount(token: string): Promise<boolean> {
    const accs = AccountManager.getAccounts();

    const res = await REST.Account.verify(token);

    if (res.status !== 200) {
      return false;
    }

    if (res.payload.newToken) {
      return await this.addAccount(res.payload.newToken);
    }

    accs.push({
      token: token,
      username: res.payload.data.username,
      email: res.payload.data.email,
      firstName: res.payload.data.firstName,
      lastName: res.payload.data.lastName,
    });

    try {
      localStorage.setItem(AccountManager.LS_KEY, JSON.stringify(accs));

      return true;
    } catch (e) {
      return false;
    }
  }

  public static removeAccount(acc: Account): boolean {
    const accs = AccountManager.getAccounts().filter((a) => {
      return a.username !== acc.username;
    });

    localStorage.setItem(AccountManager.LS_KEY, JSON.stringify(accs));

    return true;
  }

  public static getActiveToken(): string {
    return localStorage.getItem("token") as string;
  }

  public static async setActiveToken(token: string): Promise<void> {
    await AccountManager.addAccount(localStorage.getItem("token") as string);

    localStorage.setItem("token", token);
  }

  public static overrideActiveToken(token: string): void {
    localStorage.setItem("token", token);
  }
}
