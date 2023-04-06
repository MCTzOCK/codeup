/**
 * @author The InCode Devs
 * @copyright 2018-2021 The InCode Developers <https://github.com/InCodeDevs>
 */
import * as Blockly from "blockly";

export class AskBlock {
  /**
   * Registers the "Ask" block to the blockly registry
   */
  public static registerBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "ask",
        message0: 'Frage "%1" und speicher die Antwort in %2',
        args0: [
          {
            type: "field_input",
            name: "QUESTION",
            text: '"Frage"',
          },
          {
            type: "field_input",
            name: "VARIABLE_NAME",
            text: "x",
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
