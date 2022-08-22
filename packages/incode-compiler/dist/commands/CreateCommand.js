"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOM_Elements_1 = require("../types/DOM.Elements");
var CreateCommand = /** @class */ (function () {
    function CreateCommand() {
    }
    /*
     * Create Command
     *
     * Usage: Erstelle <name> als Variable
     * Usage: Erstelle <name> als Variable mit dem Wert <value>
     * Usage: Erstelle <name> als <DOM.Element>
     */
    CreateCommand.prototype.run = function (sourceTree) {
        var name = sourceTree.args[0];
        var type = sourceTree.args[2];
        if (!name || !type) {
            throw new Error("Missing arguments");
        }
        if (type.toLowerCase() === "variable") {
            if (sourceTree.args.length === 3) {
                return "let ".concat(name, " = null;");
            }
            else {
                var value = sourceTree.args[6].replace(/\u0000/g, " ");
                if (!value) {
                    throw new Error("Missing value");
                }
                return "let ".concat(name, " = ").concat(value, ";");
            }
        }
        else {
            if (DOM_Elements_1.DOM.hasOwnProperty(type.toLowerCase())) {
                return "let ".concat(name, " = document.createElement(\"").concat(DOM_Elements_1.DOM[type.toLowerCase()], "\");");
            }
            else {
                throw new Error("Unknown type");
            }
        }
    };
    return CreateCommand;
}());
exports.default = CreateCommand;
//# sourceMappingURL=CreateCommand.js.map