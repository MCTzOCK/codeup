/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */

import * as Blockly from "blockly";

export class IfNumberBlock {
  /**
   * Registers the "IfNumber" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "if_number",
        message0: "Wenn %1 %2 %3 ist %4",
        args0: [
          {
            type: "field_input",
            name: "VARIABLE_NAME",
            text: "x",
          },
          {
            type: "field_dropdown",
            name: "OPERATOR",
            options: [
              ["Gleich", "gleich"],
              ["Kleiner", "kleiner"],
              ["Größer", "größer"],
              ["Kleiner oder gleich", "kleiner-gleich"],
              ["Größer oder gleich", "größer-gleich"],
            ],
          },
          {
            type: "field_number",
            name: "NUMBER",
            value: 0,
          },
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
