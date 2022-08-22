"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AddCommand = /** @class */ (function () {
    function AddCommand() {
    }
    /*
     * Add Command
     *
     * Usage: Addiere <zahl|variable> zu <variable>
     */
    AddCommand.prototype.run = function (sourceTree) {
        if (sourceTree.args.length < 3) {
            throw new Error("Missing arguments");
        }
        var name = sourceTree.args[2];
        var modifier = sourceTree.args[0];
        if (!name || !modifier) {
            throw new Error("Missing arguments");
        }
        return "".concat(name, " += ").concat(modifier, ";");
    };
    return AddCommand;
}());
exports.default = AddCommand;
//# sourceMappingURL=AddCommand.js.map