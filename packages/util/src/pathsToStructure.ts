/**
 * packages/util/src/pathsToStructure.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.08.2022
 *
 */

export default function pathsToStructure(paths: string[]) {
  let result: any = [];
  let level = { result };

  for (const path of paths) {
    path.split("/").reduce((r: any, name: any, i: any, a: any) => {
      if (!r[name]) {
        r[name] = { result: [] };
        r.result.push({ name, children: r[name].result });
      }
      return r[name];
    }, level);
  }

  result[0].name = "/home/runner";

  return result;
}
