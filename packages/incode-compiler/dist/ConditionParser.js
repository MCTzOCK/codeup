"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConditionParser = /** @class */ (function () {
    function ConditionParser() {
    }
    ConditionParser.parse = function (sourceTree) {
        var conditions = [];
        for (var _i = 0, _a = sourceTree.args.slice(1).join(" ").split("ist"); _i < _a.length; _i++) {
            var c = _a[_i];
            var f = c.trim().split(" ")[0].toLowerCase();
            if (c.trim() === "")
                continue;
            if (f === "und") {
                conditions.push("&&");
                conditions.push(c.trim().split("und")[1].trim());
            }
            else if (f === "oder") {
                conditions.push("||");
                conditions.push(c.trim().split("oder")[1].trim());
            }
            else {
                conditions.push(c.trim());
            }
        }
        var cond = "";
        for (var _b = 0, conditions_1 = conditions; _b < conditions_1.length; _b++) {
            var condition = conditions_1[_b];
            if (condition === "||" || condition === "&&") {
                cond += " " + condition + " ";
                continue;
            }
            var first = condition.split(" ")[0];
            var second = condition.split(" ")[condition.split(" ").length - 1];
            var operator = condition.split(" ")[1].toLowerCase();
            if (operator === "gleich") {
                operator = "==";
            }
            else if (operator === "ungleich") {
                operator = "!=";
            }
            else if (operator === "kleiner") {
                operator = "<";
            }
            else if (operator === "kleiner-gleich") {
                operator = "<=";
            }
            else if (operator === "größer") {
                operator = ">";
            }
            else if (operator === "größer-gleich") {
                operator = ">=";
            }
            cond += "".concat(first, " ").concat(operator, " ").concat(second);
        }
        return cond;
    };
    return ConditionParser;
}());
exports.default = ConditionParser;
//# sourceMappingURL=ConditionParser.js.map