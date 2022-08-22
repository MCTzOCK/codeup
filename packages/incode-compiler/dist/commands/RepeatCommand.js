"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConditionParser_1 = require("../ConditionParser");
var RepeatCommand = /** @class */ (function () {
    function RepeatCommand() {
    }
    /*
     * Repeat Command
     *
     * Usage:
     * - Wiederhole <Anzahl> mal
     * - Wiederhole solange <variable> <operator> <wert> ist
     * - Wiederhole solange <variable> <operator> <wert> ist und <Bedingung>
     * - Wiederhole solange <variable> <operator> <wert> ist oder <Bedingung>
     */
    RepeatCommand.prototype.run = function (sourceTree) {
        if (sourceTree.args.length < 2) {
            throw new Error("Not enough arguments");
        }
        if (sourceTree.args.length === 2) {
            var rs = randomString(32);
            return "for(let ".concat(rs, " = 0; ").concat(rs, " < ").concat(sourceTree.args[0], "; ").concat(rs, "++)");
        }
        else if (sourceTree.args[0] === "solange") {
            return "while(" + ConditionParser_1.default.parse(sourceTree) + ")";
        }
        else {
            throw new Error("Not implemented");
        }
    };
    return RepeatCommand;
}());
exports.default = RepeatCommand;
function randomString(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
//# sourceMappingURL=RepeatCommand.js.map