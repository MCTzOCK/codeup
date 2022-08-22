"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MultiplyCommand = /** @class */ (function () {
    function MultiplyCommand() {
    }
    /*
     * Multiply Command
     *
     * Usage: Multipliziere <variable> mit <variable|zahl>
     */
    MultiplyCommand.prototype.run = function (sourceTree) {
        if (sourceTree.args.length < 3) {
            throw new Error("Missing arguments");
        }
        var name = sourceTree.args[0];
        var modifier = sourceTree.args[2];
        if (!name || !modifier) {
            throw new Error("Missing arguments");
        }
        return "".concat(name, " *= ").concat(modifier, ";");
    };
    return MultiplyCommand;
}());
exports.default = MultiplyCommand;
//# sourceMappingURL=MultiplyCommand.js.map