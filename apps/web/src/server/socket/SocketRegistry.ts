/**
 * apps/web/src/server/socket/SocketRegistry.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.01.2023
 *
 */

export default class SocketRegistry {
  public static loggedIn: {
    [key: string]: {
      id: string;
      username: string;
      currentlyEditing?: string;
      admin?: boolean;
    };
  } = {};
}
