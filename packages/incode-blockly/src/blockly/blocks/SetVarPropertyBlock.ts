/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */

import * as Blockly from "blockly";

export class SetVarPropertyBlock {
  /**
   * Registers the "SetVarText" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "var_set_text",
        message0: "Setze %1 von %2 auf %3",
        args0: [
          {
            type: "field_dropdown",
            name: "PROPERTY_NAME",
            options: [
              ["den Text", "den Text"],
              ["den Wert", "den Wert"],
              ["die Schriftart", "die Schriftart"],
              ["den Abstand-Oben", "den Abstand-Oben"],
              ["den Abstand-Unten", "den Abstand-Unten"],
              ["den Abstand-Links", "den Abstand-Links"],
              ["den Abstand-Rechts", "den Abstand-Rechts"],
              ["den Abstand", "den Abstand"],
              ["den Innerer-Abstand-Oben", "den Innerer-Abstand-Oben"],
              ["den Innerer-Abstand-Unten", "den Innerer-Abstand-Unten"],
              ["den Innerer-Abstand-Links", "den Innerer-Abstand-Links"],
              ["den Innerer-Abstand-Rechts", "den Innerer-Abstand-Rechts"],
              ["den Innerer-Abstand", "den Innerer-Abstand"],
              ["die Id", "die Id"],
              ["die Schriftgröße", "die Schriftgröße"],
              ["die Breite", "die Breite"],
              ["die Höhe", "die Höhe"],
              ["die Rahmenbreite", "die Rahmenbreite"],
              ["die Rahmenhöhe", "die Rahmenhöhe"],
              ["die Quelle", "die Quelle"],
              ["die Umrandungsbreite-Oben", "die Umrandungsbreite-Oben"],
              ["die Umrandungsbreite-Unten", "die Umrandungsbreite-Unten"],
              ["die Umrandungsbreite-Links", "die Umrandungsbreite-Links"],
              ["die Umrandungsbreite-Rechts", "die Umrandungsbreite-Rechts"],
              ["die Umrandungsbreite", "die Umrandungsbreite"],
              ["den Umrandungsradius", "den Umrandungsradius"],
            ],
          },
          {
            type: "field_input",
            name: "VARIABLE_NAME",
            text: "x",
          },
          {
            type: "field_input",
            name: "VALUE",
            text: '"Wert"',
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
