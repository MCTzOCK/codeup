/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */
import * as Blockly from "blockly";

export class SetVarBorderStyle {
  /**
   * Registers the "SetVarBorderStyle" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "var_set_border_style",
        message0: "Setze den %1 von %2 auf %3",
        args0: [
          {
            type: "field_dropdown",
            name: "TYPE",
            options: [
              ["Umrandungsstil", "Umrandungsstil"],
              ["Umrandungsstil-Rechts", "Umrandungsstil-Rechts"],
              ["Umrandungsstil-Links", "Umrandungsstil-Links"],
              ["Umrandungsstil-Oben", "Umrandungsstil-Oben"],
              ["Umrandungsstil-Unten", "Umrandungsstil-Unten"],
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
              ["Nichts", "Nichts"],
              ["Versteckt", "Versteckt"],
              ["Gepunktet", "Gepunktet"],
              ["Gestrichelt", "Gestrichelt"],
              ["Solide", "Solide"],
              ["Doppelt", "Doppelt"],
              ["Gerillt", "Gerillt"],
              ["3d", "3d"],
              ["Eingesetzt", "Eingesetzt"],
              ["Draufgelegt", "Draufgelegt"],
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
