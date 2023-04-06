/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */
import * as Blockly from "blockly";

export class CreateMethodBlock {
  /**
   * Registers the "CreateMethod" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "create_method",
        message0: "Erstelle %1 als Methode",
        args0: [
          {
            type: "field_input",
            name: "METHOD_NAME",
            text: "methodenName",
          },
        ],
        nextStatement: null,
        colour: 290,
        tooltip: "",
        helpUrl: "",
      },
    ]);
  }
}
