"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RemoveCommand = /** @class */ (function () {
    function RemoveCommand() {
    }
    /*
     * Remove Command
     *
     * Usage: Entferne <variable> vo[n|m] <variable|Bildschirm>
     */
    RemoveCommand.prototype.run = function (sourceTree) {
        var variable = sourceTree.args[0];
        var variableOrScreen = sourceTree.args[2];
        if (sourceTree.args.length < 3) {
            throw new Error("Missing arguments");
        }
        if (variableOrScreen.toLowerCase() === "bildschirm") {
            variableOrScreen = "document.body";
        }
        return "".concat(variableOrScreen, ".removeChild(").concat(variable, ");");
    };
    return RemoveCommand;
}());
exports.default = RemoveCommand;
//# sourceMappingURL=RemoveCommand.js.map