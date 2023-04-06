/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

import * as Blockly from "blockly";

export class BlocklyCompiler {
  private compiledBlocks: any[] = [];

  /**
   * Compiles the current blockly workspace
   * @return The compiled code
   */
  compile(): string {
    let code = "";
    Blockly.getMainWorkspace()
      .getAllBlocks(true)
      .forEach((block) => {
        if (!this.compiledBlocks.includes(block)) {
          code += this.compileBlock(block);
        }
      });

    // remove empty lines
    code = code.replace(/^\s*[\r ]*\n/gm, "");

    return code;
  }

  /**
   * Compiles a single block given by the compile method
   * @param block The block to be compiled
   */
  private compileBlock(block: Blockly.Block): string {
    this.compiledBlocks.push(block);

    let code = "";

    let b = block.getInputTargetBlock("STATEMENT");

    if (b) {
      code += this.getBlockTabs(block, true) + this.getBlockText(block) + "\n";
      do {
        this.compiledBlocks.push(b);
        code += this.getBlockTabs(b, true) + this.compileBlock(b) + "\n";
        /* eslint-disable  no-cond-assign */
      } while ((b = b.getNextBlock()));
    } else {
      code += this.getBlockTabs(block, true) + this.getBlockText(block) + "\n";
    }

    return code;
  }

  /**
   * Calculates the TABS (\t) for a given block
   * @param block The block which should be calculated
   * @param log Log the TABS (\t) to the console DEFAULT = false. DEBUGGING ONLY
   * @param b1 Ignore this boolean, idiot. Just kidding, basically I created it for debugging and it now has no sense anymore
   */
  private getBlockTabs(block: Blockly.Block, log = false, b1 = true): string {
    let tabs = "";

    let currentBlock = block;

    if (block.getParent() != null && b1) {
      let neededTabs = -2;
      neededTabs =
        neededTabs +
        this.getBlockTabs(block.getParent() as Blockly.Block, log, true)
          .length -
        1;
      if ((block.getParent() as Blockly.Block).getInputTargetBlock("STATEMENT"))
        neededTabs++;
      for (let i = 0; i < neededTabs; i++) {
        tabs += "    ";
      }
    }

    while (currentBlock.getParent() != null) {
      let b = (currentBlock.getParent() as Blockly.Block).getInputTargetBlock(
        "STATEMENT"
      );
      if (
        this.getBlockText(currentBlock.getParent() as Blockly.Block).includes(
          "Methode"
        )
      )
        tabs += "    ";

      if (b) {
        do {
          if (b === block) tabs += "    ";
          /* eslint-disable  no-cond-assign */
        } while ((b = b.getNextBlock()));
      }
      currentBlock = currentBlock.getParent() as Blockly.Block;
    }

    return tabs;
  }

  /**
   * Actually compiles a block
   * @param block The block to be compiled
   */
  private getBlockText(block: Blockly.Block): string {
    let c = "";
    block.inputList.forEach((i) => {
      i.fieldRow.forEach((r) => {
        if (r.getValue() != "Start") {
          c += r.getValue() + " ";
        }
      });
    });
    return c;
  }
}
