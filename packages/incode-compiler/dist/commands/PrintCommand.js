"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrintCommand = /** @class */ (function () {
    function PrintCommand() {
    }
    /*
     * Print Command
     *
     * Usage: Gib <text> in der <Konsole|Dialogbox> aus
     */
    PrintCommand.prototype.run = function (sourceTree) {
        if (sourceTree.args.length < 5) {
            throw new Error("Missing arguments");
        }
        var text = sourceTree.args[0].replace(/\u0000/g, " ");
        var output = sourceTree.args[3];
        if (!text || !output) {
            throw new Error("Missing arguments");
        }
        if (output.toLowerCase() === "konsole") {
            return "console.log(".concat(text, ");");
        }
        if (output.toLowerCase() === "dialogbox") {
            return "alert(".concat(text, ");");
        }
        return "".concat(output, "(").concat(text, ");");
    };
    return PrintCommand;
}());
exports.default = PrintCommand;
//# sourceMappingURL=PrintCommand.js.map