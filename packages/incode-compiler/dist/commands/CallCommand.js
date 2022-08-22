"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CallCommand = /** @class */ (function () {
    function CallCommand() {
    }
    /*
     * Call Command
     *
     * Usage: Rufe <function> auf
     */
    CallCommand.prototype.run = function (sourceTree) {
        if (sourceTree.args.length < 1) {
            throw new Error("Missing arguments");
        }
        var name = sourceTree.args[0];
        if (!name) {
            throw new Error("Missing arguments");
        }
        return "".concat(name, "();");
    };
    return CallCommand;
}());
exports.default = CallCommand;
//# sourceMappingURL=CallCommand.js.map