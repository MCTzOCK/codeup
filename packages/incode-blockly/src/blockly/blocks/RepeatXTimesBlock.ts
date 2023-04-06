/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */
import * as Blockly from "blockly";

export class RepeatXTimesBlock {
  /**
   * Registers the "RepeatXTimes" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "repeat_x_times",
        message0: "Wiederhole %1 mal %2",
        args0: [
          {
            type: "field_number",
            name: "TIMES",
            value: 0,
          },
          {
            type: "input_statement",
            name: "STATEMENT",
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 210,
        tooltip: "",
        helpUrl: "",
      },
    ]);
  }
}
