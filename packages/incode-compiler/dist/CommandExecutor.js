"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommentCommand_1 = require("./commands/CommentCommand");
var CreateCommand_1 = require("./commands/CreateCommand");
var AddCommand_1 = require("./commands/AddCommand");
var SubtractCommand_1 = require("./commands/SubtractCommand");
var MultiplyCommand_1 = require("./commands/MultiplyCommand");
var DivideCommand_1 = require("./commands/DivideCommand");
var AppendCommand_1 = require("./commands/AppendCommand");
var RemoveCommand_1 = require("./commands/RemoveCommand");
var PrintCommand_1 = require("./commands/PrintCommand");
var AskCommand_1 = require("./commands/AskCommand");
var FunctionCommand_1 = require("./commands/FunctionCommand");
var CallCommand_1 = require("./commands/CallCommand");
var SetCommand_1 = require("./commands/SetCommand");
var RepeatCommand_1 = require("./commands/RepeatCommand");
var IFCommand_1 = require("./commands/IFCommand");
var ElseCommand_1 = require("./commands/ElseCommand");
var BreakCommand_1 = require("./commands/BreakCommand");
var CommandExecutor = /** @class */ (function () {
    function CommandExecutor() {
    }
    CommandExecutor.run = function (sourceTree) {
        var ret = "";
        try {
            if (sourceTree.command.toLowerCase() in CommandExecutor.COMMANDS) {
                ret += "".concat(CommandExecutor.COMMANDS[sourceTree.command.toLowerCase()].run(sourceTree));
            }
            else {
                throw new Error("Command ".concat(sourceTree.command, " not found"));
            }
        }
        catch (e) {
            ret += "/* COMPILING ERROR */\n";
            ret += "/* --------------- */\n";
            ret += "/* ".concat(e.message, " */\n");
            ret += "/* ".concat(e.stack, " */\n");
            ret += "/* ".concat(e.name, " */\n");
            ret += "/* --------------- */\n";
        }
        if (sourceTree.children.length > 0) {
            ret += " {\n";
            sourceTree.children.forEach(function (child) {
                ret += CommandExecutor.run(child);
            });
            ret += "}\n";
        }
        return ret;
    };
    CommandExecutor.COMMANDS = {
        "@": new (/** @class */ (function () {
            function class_1() {
            }
            class_1.prototype.run = function (sourceTree) {
                return sourceTree.args.join(" ");
            };
            return class_1;
        }()))(),
        "//": new CommentCommand_1.default(),
        "#": new CommentCommand_1.default(),
        "!": new CommentCommand_1.default(),
        erstelle: new CreateCommand_1.default(),
        addiere: new AddCommand_1.default(),
        subtrahiere: new SubtractCommand_1.default(),
        multipliziere: new MultiplyCommand_1.default(),
        dividiere: new DivideCommand_1.default(),
        füge: new AppendCommand_1.default(),
        entferne: new RemoveCommand_1.default(),
        gib: new PrintCommand_1.default(),
        frage: new AskCommand_1.default(),
        funktion: new FunctionCommand_1.default(),
        rufe: new CallCommand_1.default(),
        setze: new SetCommand_1.default(),
        wiederhole: new RepeatCommand_1.default(),
        wenn: new IFCommand_1.default(),
        sonst: new ElseCommand_1.default(),
        stopp: new BreakCommand_1.default(),
    };
    return CommandExecutor;
}());
exports.default = CommandExecutor;
//# sourceMappingURL=CommandExecutor.js.map