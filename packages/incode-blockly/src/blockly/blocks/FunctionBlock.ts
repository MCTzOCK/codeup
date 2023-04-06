/**
 * packages/incode-blockly/src/blockly/blocks/FunctionBlock.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.04.2023
 *
 */
import * as Blockly from "blockly";

export class FunctionBlock {
  /**
   * Registers the "Function" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "function",
        message0: "Funktion %1 %2",
        args0: [
          {
            type: "field_input",
            name: "MESSAGE",
            text: "Wert",
          },
          {
            type: "input_statement",
            name: "STATEMENT",
          },
        ],
        colour: 120,
        tooltip: "",
        helpUrl: "",
      },
    ]);
  }
}
