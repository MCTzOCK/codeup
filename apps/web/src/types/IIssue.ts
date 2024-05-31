/**
 * apps/web/src/types/IIssue.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.05.2024
 *
 */

export interface IIssue {
  _id: string;
  createdAt: string;
  project: string;
  title: string;
  description: string;
  status: string;
  priority: string;
}
