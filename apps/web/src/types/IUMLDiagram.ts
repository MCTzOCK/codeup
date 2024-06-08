/**
 * apps/web/src/types/IUMLDiagram.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.06.2024
 *
 */

export interface IUMLDiagram {
  _id: string;
  createdAt: string;
  project: string;
  name: string;
  type: string;
  data: string;
}
