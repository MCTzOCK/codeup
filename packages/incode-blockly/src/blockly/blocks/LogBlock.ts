/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */

import * as Blockly from "blockly";

export class LogBlock {
  /**
   * Registers the "Log" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "log",
        message0: 'Gib "%1" in der %2 aus',
        args0: [
          {
            type: "field_input",
            name: "MESSAGE",
            text: "Wert",
          },
          {
            type: "field_dropdown",
            name: "OUTPUT",
            options: [
              ["Konsole", "Konsole"],
              ["Dialogbox", "Dialogbox"],
            ],
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 120,
        tooltip: "",
        helpUrl: "",
      },
    ]);
  }
}
