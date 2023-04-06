/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */
import * as Blockly from "blockly";

export class AddToElementBlock {
  /**
   * Registers the "AddToElement" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "add_to_element",
        message0: "Füge %1 zu %2 hinzu",
        args0: [
          {
            type: "field_input",
            name: "CHILD",
            text: "x",
          },
          {
            type: "field_input",
            name: "PARENT",
            text: "y",
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 120,
        tooltip: "",
        helpUrl: "",
      },
    ]);
  }
}
