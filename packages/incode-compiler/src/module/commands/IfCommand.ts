/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import { AliasManager } from "../AliasManager";
import { InCodeCommand } from "./InCodeCommand";
import { CommandExecutor } from "./CommandExecutor";

export class IfCommand extends InCodeCommand {
  public execute(args: string[]): string {
    // [4] x gleich 2 ist
    // [5] x is equal to 2
    // [4] x gedrückt wird <command>
    // [4] x is pressed <command>
    // [6] die Taste x gedrückt wird <command>
    // [6] the key x is pressed <command>

    if (args.length < 4) {
      return "// This line contained an if command, but it was missing arguments.";
    } else {
      if (
        AliasManager.getOperatorAliases(args[1]).length > 0 ||
        AliasManager.getOperatorAliases(args[2]).length > 0
      ) {
        // normal if --- then
        let operator;
        let operatorPosition;
        let first;
        let second;

        if (AliasManager.getOperatorAliases(args[1]).length > 0) {
          operator = AliasManager.getOperatorAliases(args[1])[0];
          operatorPosition = 1;
        } else {
          operator = AliasManager.getOperatorAliases(args[2])[0];
          operatorPosition = 2;
        }

        if (operatorPosition === 1) {
          first = args[0];
          second = args[2].replace(/\u0000/g, " ");
        } else {
          first = args[0];
          second = args[1].replace(/\u0000/g, " ");
        }
        return `if (${first} ${operator} ${second})`;
      } else if (
        AliasManager.getEventAliases(args[1]).length > 0 ||
        AliasManager.getEventAliases(args[2]).length > 0
      ) {
        // event listener
        let first = args[0];
        let event;
        let eventPosition;
        let command;
        command = args.slice(3).join(" ");

        if (AliasManager.getEventAliases(args[1]).length > 0) {
          event = AliasManager.getEventAliases(args[1])[0];
          eventPosition = 1;
        } else {
          event = AliasManager.getEventAliases(args[2])[0];
          eventPosition = 2;
        }

        return `${first}.addEventListener("${event}", () => {
  ${CommandExecutor.executeCommand(command)}
});`;
      } else if (
        AliasManager.getTypeAliases(args[1]).length > 0 &&
        AliasManager.getTypeAliases(args[1])[0] === "key"
      ) {
        const command = args.slice(5).join(" ");

        return `document.addEventListener("keydown", (e) => {
  if (e.key === "${args[2]}") {
    ${CommandExecutor.executeCommand(command)}
  }
});`;
      }
    }
    return "";
  }
}
