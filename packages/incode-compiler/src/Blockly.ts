/**
 * packages/incode-compiler/src/Blockly.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.04.2023
 *
 */

import * as Blockly from "blockly";

export class BlocklyCompiler {
  private compiledBlocks: any[] = [];

  /**
   * Compiles the current blockly workspace
   * @return The compiled code
   */
  compile(): string {
    const blocks = Blockly.getMainWorkspace().getTopBlocks(true);

    let code = "";

    for (const topBlock of blocks) {
      let baseIntents = 0;
      if (topBlock.type !== "start") {
        baseIntents++;
        code += this.getBlockText(topBlock) + "\n";
      }

      const allChildren = topBlock
        .getDescendants(true)
        .filter((b) => {
          if (b.getSurroundParent()) return false;
          return true;
        })
        .filter((b) => b !== topBlock);

      const processBlock = (block: Blockly.Block, addInts: number = 0) => {
        code +=
          "\t".repeat(baseIntents + addInts) + this.getBlockText(block) + "\n";
        const children = block.getDescendants(true).filter((b) => {
          return (b.getSurroundParent() as Blockly.Block) === block;
        });

        if (children.length > 0) {
          for (const c of children) {
            processBlock(c, addInts + 1);
          }
        }
      };

      for (const b of allChildren) {
        processBlock(b);
      }
    }
    return code;
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
