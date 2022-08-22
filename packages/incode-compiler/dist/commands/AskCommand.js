"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AskCommand = /** @class */ (function () {
    function AskCommand() {
    }
    /*
     * Ask Command
     *
     * Usage: Frage <text> und speicher die Antwort in <variable>
     */
    AskCommand.prototype.run = function (sourceTree) {
        if (sourceTree.args.length < 7) {
            throw new Error("Missing arguments");
        }
        var question = sourceTree.args[0].replace(/\u0000/g, " ");
        var name = sourceTree.args[6];
        if (!question || !name) {
            throw new Error("Missing arguments");
        }
        return "let ".concat(name, " = prompt(").concat(question, ");");
    };
    return AskCommand;
}());
exports.default = AskCommand;
//# sourceMappingURL=AskCommand.js.map