"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FunctionCommand = /** @class */ (function () {
    function FunctionCommand() {
    }
    /*
     * Function Command
     *
     * Usage:
     * - Funktion <name>
     */
    FunctionCommand.prototype.run = function (sourceTree) {
        if (sourceTree.args.length < 1) {
            throw new Error("Missing arguments");
        }
        var name = sourceTree.args[0];
        if (!name) {
            throw new Error("Missing arguments");
        }
        return "function ".concat(name, "()");
    };
    return FunctionCommand;
}());
exports.default = FunctionCommand;
//# sourceMappingURL=FunctionCommand.js.map