/**
 * apps/web/src/types/IAskPost.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.06.23
 *
 */

export interface IAskPost {
  _id: string;
  content: string;
  username: string;
  user: string;
  createdAt: string;
  embeds: any[];
  parent: string;
}
