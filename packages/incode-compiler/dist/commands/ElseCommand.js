"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommandExecutor_1 = require("../CommandExecutor");
var ElseCommand = /** @class */ (function () {
    function ElseCommand() {
    }
    /*
     * Else Command
     *
     * Usage:
     * - Sonst
     * - Sonst <wenn_befehl>
     */
    ElseCommand.prototype.run = function (sourceTree) {
        if (sourceTree.args.length === 0) {
            return "else";
        }
        else {
            var a = sourceTree.args;
            a.shift();
            var x = CommandExecutor_1.default.run({
                command: "Wenn",
                args: a,
                children: [],
                intents: 0,
            });
            return "else " + x;
        }
    };
    return ElseCommand;
}());
exports.default = ElseCommand;
//# sourceMappingURL=ElseCommand.js.map