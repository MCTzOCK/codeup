"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppendCommand = /** @class */ (function () {
    function AppendCommand() {
    }
    /*
     * Append Command
     *
     * Usage: Füge <variable> zu[m] <variable|Bildschirm> hinzu
     */
    AppendCommand.prototype.run = function (sourceTree) {
        var variable = sourceTree.args[0];
        var variableOrScreen = sourceTree.args[2];
        if (sourceTree.args.length < 3) {
            throw new Error("Missing arguments");
        }
        if (variableOrScreen.toLowerCase() === "bildschirm") {
            variableOrScreen = "document.body";
        }
        return "".concat(variableOrScreen, ".appendChild(").concat(variable, ");");
    };
    return AppendCommand;
}());
exports.default = AppendCommand;
//# sourceMappingURL=AppendCommand.js.map