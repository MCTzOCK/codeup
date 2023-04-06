/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */

import * as Blockly from "blockly";

export class StartBlock {
  /**
   * Registers the "Start" block to the blockly registry
   * Attention: This block is ignored when compiling
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "start",
        message0: "Start",
        nextStatement: null,
        colour: 210,
      },
    ]);
  }
}
