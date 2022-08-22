"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommentCommand = /** @class */ (function () {
    function CommentCommand() {
    }
    /*
     * Comment Command
     *
     * Usage:   // <comment>
     *          # <comment>
     *          ! <comment>
     */
    CommentCommand.prototype.run = function (sourceTree) {
        return "//".concat(sourceTree.args.join(" "));
    };
    return CommentCommand;
}());
exports.default = CommentCommand;
//# sourceMappingURL=CommentCommand.js.map