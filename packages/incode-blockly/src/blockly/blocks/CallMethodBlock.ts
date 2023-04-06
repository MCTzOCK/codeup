/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */
import * as Blockly from "blockly";

export class CallMethodBlock {
  /**
   * Registers the "CallMethod" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "call_method",
        message0: "Rufe die Methode %1 auf",
        args0: [
          {
            type: "field_input",
            name: "METHOD_NAME",
            text: "methodenName",
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 290,
        tooltip: "",
        helpUrl: "",
      },
    ]);
  }
}
