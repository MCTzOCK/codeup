/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */

import * as Blockly from "blockly";

export class IfEventBlock {
  /**
   * Registers the "IfEvent" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "if_event",
        message0: "Wenn %1 %2 wird rufe %3 auf",
        args0: [
          {
            type: "field_input",
            name: "VARIABLE_NAME",
            text: "x",
          },
          {
            type: "field_dropdown",
            name: "EVENT",
            options: [
              ["Gedrück", "gedrückt"],
              ["Berührt", "berührt"],
              ["Nicht Berührt", "nicht-berührt"],
            ],
          },
          {
            type: "field_input",
            name: "METHOD:NAME",
            text: "methodenName",
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
