/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */
import * as Blockly from "blockly";

export class SetVarDecorationPropsBlock {
  /**
   * Registers the "SetVarDecorProps" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "var_set_decor_props",
        message0: "Setze %1 von %2 auf %3",
        args0: [
          {
            type: "field_dropdown",
            name: "TYPE",
            options: [
              ["die Textdekoration", "die Textdekoration"],
              ["den Schriftstil", "den Schriftstil"],
            ],
          },
          {
            type: "field_input",
            name: "VARIABLE_NAME",
            text: "x",
          },
          {
            type: "field_dropdown",
            name: "COLOR",
            options: [
              ["Unterstrichen", "Unterstrichen"],
              ["Überstrichen", "Überstrichen"],
              ["Durchgestrichen", "Durchgestrichen"],
              ["Blink", "Blink"],
              ["Nichts", "Nichts"],
              ["Unterstrichen-Überstrichen", "Unterstrichen-Überstrichen"],
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
