/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

import { AddToElementBlock } from "./blocks/AddToElementBlock";
import { AddToScreenBlock } from "./blocks/AddToScreenBlock";
import { AskBlock } from "./blocks/AskBlock";
import { CallMethodBlock } from "./blocks/CallMethodBlock";
import { CreateMethodBlock } from "./blocks/CreateMethodBlock";
import { CreateVarBlock } from "./blocks/CreateVarBlock";
import { CreateVarTypeBlock } from "./blocks/CreateVarTypeBlock";
import { ElseBlock } from "./blocks/ElseBlock";
import { ElseIfNumberBlock } from "./blocks/ElseIfNumberBlock";
import { IfEventBlock } from "./blocks/IfEventBlock";
import { IfNumberBlock } from "./blocks/IfNumberBlock";
import { ElseIfTextBlock } from "./blocks/ElseIfTextBlock";
import { IfTextBlock } from "./blocks/IfTextBlock";
import { LogBlock } from "./blocks/LogBlock";
import { RepeatWhile } from "./blocks/RepeatWhile";
import { RepeatWhileNumber } from "./blocks/RepeatWhileNumber";
import { RepeatXTimesBlock } from "./blocks/RepeatXTimesBlock";
import { SetVarBorderStyle } from "./blocks/SetVarBorderStyle";
import { SetVarColorBlock } from "./blocks/SetVarColorBlock";
import { SetVarDecorationPropsBlock } from "./blocks/SetVarDecorationPropsBlock";
import { SetVarFontWeight } from "./blocks/SetVarFontWeight";
import { SetVarPositionBlock } from "./blocks/SetVarPositionBlock";
import { SetVarPropertyBlock } from "./blocks/SetVarPropertyBlock";
import { SetVarTextAlign } from "./blocks/SetVarTextAlign";
import { StartBlock } from "./blocks/StartBlock";
import { FunctionBlock } from "./blocks/FunctionBlock";

export default class Blocks {
  public static register() {
    FunctionBlock.registerBlock();
    AddToElementBlock.registerBlock();
    AddToScreenBlock.registerBlock();
    AskBlock.registerBlock();
    CallMethodBlock.registerBlock();
    CreateMethodBlock.registerBlock();
    CreateVarBlock.registerBlock();
    CreateVarTypeBlock.registerBlock();
    ElseBlock.registerBlock();
    ElseIfNumberBlock.registerBlock();
    ElseIfTextBlock.registerBlock();
    IfEventBlock.registerBlock();
    IfNumberBlock.registerBlock();
    IfTextBlock.registerBlock();
    LogBlock.registerBlock();
    RepeatWhile.registerBlock();
    RepeatWhileNumber.registerBlock();
    RepeatXTimesBlock.registerBlock();
    SetVarBorderStyle.registerBlock();
    SetVarColorBlock.registerBlock();
    SetVarDecorationPropsBlock.registerBlock();
    SetVarFontWeight.registerBlock();
    SetVarPositionBlock.registerBlock();
    SetVarPropertyBlock.registerBlock();
    SetVarTextAlign.registerBlock();
    StartBlock.registerBlock();
  }
}
