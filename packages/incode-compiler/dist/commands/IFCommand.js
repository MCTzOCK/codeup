"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var incode_ast_generator_1 = require("@codeup/incode-ast-generator");
var CommandExecutor_1 = require("../CommandExecutor");
var ConditionParser_1 = require("../ConditionParser");
var IFCommand = /** @class */ (function () {
    function IFCommand() {
    }
    /*
     * IF Command
     *
     * Usage:
     * - Wenn <Bedingung>
     * - Wenn <Bedingung> und <Bedingung>
     * - Wenn <Bedingung> oder <Bedingung>
     * - Wenn <Bedingung> und <Bedingung> oder <Bedingung> ...
     * - Wenn <variable> <gedrückt|berührt|verlassen> wird
     * - Wenn Taste <Taste> gedrückt wird <command>
     */
    IFCommand.prototype.run = function (sourceTree) {
        if (sourceTree.args.length < 1) {
            throw new Error("Not enough arguments");
        }
        if (sourceTree.args[0].toLowerCase() === "taste") {
            return "document.addEventListener(\"keydown\", (event) => {\n        if(event.key === \"".concat(sourceTree.args[1], "\") {\n          ").concat(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate(sourceTree.args
                .slice(4, sourceTree.args.length)
                .join(" ")
                .replace(/\u0000/g, " "))[0]), "\n        }\n      });");
        }
        else if (["gedrückt", "berührt", "verlassen"].includes(sourceTree.args[1].toLowerCase())) {
            var event_1 = "";
            if (sourceTree.args[1].toLowerCase() === "gedrückt") {
                event_1 = "click";
            }
            else if (sourceTree.args[1].toLowerCase() === "berührt") {
                event_1 = "mouseover";
            }
            else if (sourceTree.args[1].toLowerCase() === "verlassen") {
                event_1 = "mouseleave";
            }
            return "".concat(sourceTree.args[0], ".addEventListener(\"").concat(event_1, "\", (event) => {\n          ").concat(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate(sourceTree.args
                .slice(3, sourceTree.args.length)
                .join(" ")
                .replace(/\u0000/g, " "))[0]), "\n      });");
        }
        else {
            sourceTree.args = __spreadArray(["_"], sourceTree.args, true);
            var cond = ConditionParser_1.default.parse(sourceTree);
            return "if(".concat(cond, ")");
        }
    };
    return IFCommand;
}());
exports.default = IFCommand;
//# sourceMappingURL=IFCommand.js.map