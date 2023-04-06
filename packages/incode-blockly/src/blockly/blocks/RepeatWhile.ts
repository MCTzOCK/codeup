/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */
import * as Blockly from "blockly";

export class RepeatWhile {
  /**
   * Registers the "RepeatWhile" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "repeat_while",
        message0: "Wiederhole solange %1 %2 %3 ist %4",
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
              ["Nicht gleich", "nicht-gleich"],
            ],
          },
          {
            type: "field_input",
            name: "VALUE",
            text: "Text",
          },
          {
            type: "input_statement",
            name: "STATEMENT",
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 210,
        tooltip: "",
        helpUrl: "",
      },
    ]);
  }
}
