/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */
import * as Blockly from "blockly";

export class SetVarTextAlign {
  /**
   * Registers the "SetVarTextAlign" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "var_set_text_align",
        message0: "Setze die Textausrichtung von %1 auf %2",
        args0: [
          {
            type: "field_input",
            name: "VARIABLE_NAME",
            text: "x",
          },
          {
            type: "field_dropdown",
            name: "COLOR",
            options: [
              ["Links", "Links"],
              ["Rechts", "Rechts"],
              ["Mitte", "Mitte"],
            ],
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 30,
        tooltip: "",
        helpUrl: "",
      },
    ]);
  }
}
