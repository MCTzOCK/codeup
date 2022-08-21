/**
 * packages/incode-compiler/src/ConditionParser.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */
import { AbstractSyntaxTree } from "@codeup/incode-ast-generator";

export default class ConditionParser {
  public static parse(sourceTree: AbstractSyntaxTree): string {
    let conditions: string[] = [];

    for (const c of sourceTree.args.slice(1).join(" ").split("ist")) {
      let f = c.trim().split(" ")[0].toLowerCase();

      if (c.trim() === "") continue;

      if (f === "und") {
        conditions.push("&&");
        conditions.push(c.trim().split("und")[1].trim());
      } else if (f === "oder") {
        conditions.push("||");
        conditions.push(c.trim().split("oder")[1].trim());
      } else {
        conditions.push(c.trim());
      }
    }

    let cond = "";

    for (const condition of conditions) {
      if (condition === "||" || condition === "&&") {
        cond += " " + condition + " ";
        continue;
      }

      const first = condition.split(" ")[0];
      const second = condition.split(" ")[condition.split(" ").length - 1];
      let operator = condition.split(" ")[1].toLowerCase();

      if (operator === "gleich") {
        operator = "==";
      } else if (operator === "ungleich") {
        operator = "!=";
      } else if (operator === "kleiner") {
        operator = "<";
      } else if (operator === "kleiner-gleich") {
        operator = "<=";
      } else if (operator === "größer") {
        operator = ">";
      } else if (operator === "größer-gleich") {
        operator = ">=";
      }

      cond += `${first} ${operator} ${second}`;
    }

    return cond;
  }
}
