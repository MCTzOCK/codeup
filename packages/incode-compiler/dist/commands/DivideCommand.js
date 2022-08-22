"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DivideCommand = /** @class */ (function () {
    function DivideCommand() {
    }
    /*
     * Divide Command
     *
     * Usage: Dividiere <variable> durch <variable|zahl>
     */
    DivideCommand.prototype.run = function (sourceTree) {
        if (sourceTree.args.length < 3) {
            throw new Error("Missing arguments");
        }
        var name = sourceTree.args[0];
        var modifier = sourceTree.args[2];
        if (!name || !modifier) {
            throw new Error("Missing arguments");
        }
        return "".concat(name, " /= ").concat(modifier, ";");
    };
    return DivideCommand;
}());
exports.default = DivideCommand;
//# sourceMappingURL=DivideCommand.js.map