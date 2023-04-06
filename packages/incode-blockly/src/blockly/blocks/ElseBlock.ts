/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */

import * as Blockly from "blockly";

export class ElseBlock {
  /**
   * Registers the "Else" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "else",
        message0: "Sonst %1",
        args0: [
          {
            type: "input_statement",
            name: "STATEMENT",
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: "#5577EE",
        tooltip: "",
        helpUrl: "",
      },
    ]);
  }
}
