"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SubtractCommand = /** @class */ (function () {
    function SubtractCommand() {
    }
    /*
     * Subtract Command
     *
     * Usage: Subtrahiere <zahl|variable> von <variable>
     */
    SubtractCommand.prototype.run = function (sourceTree) {
        if (sourceTree.args.length < 3) {
            throw new Error("Missing arguments");
        }
        var name = sourceTree.args[2];
        var modifier = sourceTree.args[0];
        if (!name || !modifier) {
            throw new Error("Missing arguments");
        }
        return "".concat(name, " -= ").concat(modifier, ";");
    };
    return SubtractCommand;
}());
exports.default = SubtractCommand;
//# sourceMappingURL=SubtractCommand.js.map