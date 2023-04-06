/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */
import * as Blockly from "blockly";

export class CreateVarTypeBlock {
  /**
   * Registers the "CreateVarType" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "var_create_type",
        message0: "Erstelle %1 als %2",
        args0: [
          {
            type: "field_input",
            name: "VARIABLE_NAME",
            text: "x",
          },
          {
            type: "field_dropdown",
            name: "VARIABLE_TYPE",
            options: [
              ["Knopf", "Knopf"],
              ["Absatz", "Absatz"],
              ["Text", "Text"],
              ["Bild", "Bild"],
              ["Überschrift", "Überschrift"],
              ["Eingabefeld", "Eingabefeld"],
              ["Tabelle", "Tabelle"],
              ["Zeile", "Zeile"],
              ["Spalte", "Spalte"],
              ["Zeilenumbruch", "Zeilenumbruch"],
              ["Video", "Video"],
              ["Ton", "Ton"],
              ["Fenster", "Fenster"],
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
