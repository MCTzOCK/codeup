/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */
import * as Blockly from "blockly";

export class SetVarColorBlock {
  /**
   * Registers the "SetVarColor" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "var_set_color",
        message0: "Setze die %1 von %2 auf %3",
        args0: [
          {
            type: "field_dropdown",
            name: "TYPE",
            options: [
              ["Farbe", "Farbe"],
              ["Hintergrundfarbe", "Hintergrundfarbe"],
              ["Umrandungsfarbe", "Umrandungsfarbe"],
              ["Umrandungsfarbe-Oben", "Umrandungsfarbe-Oben"],
              ["Umrandungsfarbe-Unten", "Umrandungsfarbe-Unten"],
              ["Umrandungsfarbe-Rechts", "Umrandungsfarbe-Rechts"],
              ["Umrandungsfarbe-Links", "Umrandungsfarbe-Links"],
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
              ["Schwarz", "Schwarz"],
              ["Weiß", "Weiß"],
              ["Blau", "Blau"],
              ["Grün", "Grün"],
              ["Gelb", "Gelb"],
              ["Grau", "Grau"],
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
