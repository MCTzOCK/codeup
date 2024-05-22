/**
 * apps/web/src/types/IProject.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.05.2024
 *
 */

export interface IProject {
  _id: string;
  createdAt: string;
  users: string[];
  name: string;
  projectType: "static";
  modifiers: string[];
}
