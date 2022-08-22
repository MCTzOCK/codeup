"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SetCommand = /** @class */ (function () {
    function SetCommand() {
    }
    /*
     * Set Command
     *
     * Usage: Setze [den|die|das] <property> von <variable> auf <value>
     */
    SetCommand.prototype.run = function (sourceTree) {
        if (sourceTree.args.length < 6) {
            throw new Error("Command ".concat(sourceTree.command, " requires at least 4 arguments"));
        }
        var property = sourceTree.args[1];
        var variable = sourceTree.args[3];
        var value = sourceTree.args[5].replace(/\u0000/g, " ");
        var obj = {
            name: "_incode.default",
            aliases: [],
            type: "",
            append: "",
            values: [],
        };
        for (var i = 0; i < SetCommand.data.length; i++) {
            var entry = SetCommand.data[i];
            if (entry.aliases.includes(property.toLowerCase())) {
                obj = entry;
                break;
            }
        }
        if (obj.name !== "_incode.default") {
            var v = value;
            for (var i = 0; i < obj.values.length; i++) {
                if (obj.values[i].aliases.includes(v.toLowerCase())) {
                    v = obj.values[i].name;
                    break;
                }
            }
            if (obj.type === "style") {
                return "".concat(variable, ".style.").concat(obj.name, " = \"").concat(v).concat(obj.append, "\";");
            }
            else if (obj.type === "attribute") {
                return "".concat(variable, ".").concat(obj.name, " = ").concat(v).concat(obj.append, ";");
            }
        }
        else {
            if (property.toLowerCase() === "wert") {
                return "".concat(variable, " = ").concat(value, ";");
            }
            else {
                throw new Error("Unknown property ".concat(property));
            }
        }
        return "".concat(variable, ".").concat(property, " = ").concat(value, ";");
    };
    SetCommand.colors = [
        {
            name: "blue",
            aliases: ["blue", "blau"],
        },
        {
            name: "lime",
            aliases: ["green", "grün"],
        },
        {
            name: "yellow",
            aliases: ["yellow", "gelb"],
        },
        {
            name: "red",
            aliases: ["red", "rot"],
        },
        {
            name: "white",
            aliases: ["white", "weiss"],
        },
        {
            name: "black",
            aliases: ["black", "schwarz"],
        },
    ];
    SetCommand.data = [
        {
            name: "color",
            aliases: ["farbe", "color"],
            type: "style",
            append: "",
            values: SetCommand.colors,
        },
        {
            name: "backgroundColor",
            aliases: ["hintergrundfarbe", "backgroundcolor"],
            type: "style",
            append: "",
            values: SetCommand.colors,
        },
        {
            name: "innerText",
            aliases: ["text"],
            type: "attribute",
            append: "",
            values: [],
        },
        {
            name: "textDecoration",
            aliases: ["textdekoration", "textdecoration"],
            type: "style",
            append: "",
            values: [
                {
                    name: "underline",
                    aliases: ["underline", "unterstrichen"],
                },
                {
                    name: "overline",
                    aliases: ["overline", "überstrichen"],
                },
                {
                    name: "line-through",
                    aliases: ["line-through", "durchgestrichen"],
                },
                {
                    name: "underline overline",
                    aliases: ["underline-overline", "unterstrichen-überstrichen"],
                },
            ],
        },
        {
            name: "textAlign",
            aliases: ["textausrichtung", "textalign"],
            type: "style",
            append: "",
            values: [
                {
                    name: "left",
                    aliases: ["left", "links"],
                },
                {
                    name: "center",
                    aliases: ["center", "zentriert"],
                },
                {
                    name: "right",
                    aliases: ["right", "rechts"],
                },
            ],
        },
        {
            name: "fontWeight",
            aliases: ["fontweight", "schriftbreite"],
            type: "style",
            append: "",
            values: [
                {
                    name: "normal",
                    aliases: ["normal", "normal"],
                },
                {
                    name: "bold",
                    aliases: ["bold", "fett"],
                },
                {
                    name: "bolder",
                    aliases: ["bolder", "schwächer"],
                },
                {
                    name: "lighter",
                    aliases: ["lighter", "leichter"],
                },
            ],
        },
        {
            name: "fontFamily",
            aliases: ["fontfamily", "schriftart", "font"],
            type: "style",
            append: "",
            values: [],
        },
        {
            name: "margingTop",
            aliases: ["margintop", "abstand-oben"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "marginRight",
            aliases: ["marginright", "abstand-rechts"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "marginBottom",
            aliases: ["marginbottom", "abstand-unten"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "marginLeft",
            aliases: ["marginleft", "abstand-links"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "margin",
            aliases: ["margin", "abstand"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "paddingTop",
            aliases: ["paddingtop", "innerer-abstand-oben"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "paddingRight",
            aliases: ["paddingright", "innerer-abstand-rechts"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "paddingBottom",
            aliases: ["paddingbottom", "innerer-abstand-unten"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "paddingLeft",
            aliases: ["paddingleft", "innerer-abstand-links"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "padding",
            aliases: ["padding", "innerer-abstand"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "fontSize",
            aliases: ["fontsize", "schriftgröße"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "width",
            aliases: ["width", "breite"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "height",
            aliases: ["height", "höhe"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "src",
            aliases: ["src", "quelle"],
            type: "attribute",
            append: "",
            values: [],
        },
        {
            name: "position",
            aliases: ["position"],
            type: "style",
            append: "",
            values: [
                {
                    name: "absolute",
                    aliases: ["absolute", "absolut"],
                },
                {
                    name: "relative",
                    aliases: ["relative", "relativ"],
                },
                {
                    name: "fixed",
                    aliases: ["fixed", "fest"],
                },
            ],
        },
        {
            name: "borderTopWidth",
            aliases: ["bordertopwidth", "umrandungsbreite-oben"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "borderRightWidth",
            aliases: ["borderrightwidth", "umrandungsbreite-rechts"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "borderBottomWidth",
            aliases: ["borderbottomwidth", "umrandungsbreite-unten"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "borderLeftWidth",
            aliases: ["borderleftwidth", "umrandungsbreite-links"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "borderWidth",
            aliases: ["borderwidth", "umrandungsbreite"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "borderTopStyle",
            aliases: ["bordertopstyle", "umrandungsstil-oben"],
            type: "style",
            append: "",
            values: [
                {
                    name: "none",
                    aliases: ["none", "keine"],
                },
                {
                    name: "solid",
                    aliases: ["solid", "durchgezogen", "solide"],
                },
                {
                    name: "dashed",
                    aliases: ["dashed", "gestrichen"],
                },
                {
                    name: "dotted",
                    aliases: ["dotted", "gepunktet"],
                },
                {
                    name: "double",
                    aliases: ["double", "doppelt"],
                },
            ],
        },
        {
            name: "borderRightStyle",
            aliases: ["borderrightstyle", "umrandungsstil-rechts"],
            type: "style",
            append: "",
            values: [
                {
                    name: "none",
                    aliases: ["none", "keine"],
                },
                {
                    name: "solid",
                    aliases: ["solid", "durchgezogen", "solide"],
                },
                {
                    name: "dashed",
                    aliases: ["dashed", "gestrichen"],
                },
                {
                    name: "dotted",
                    aliases: ["dotted", "gepunktet"],
                },
                {
                    name: "double",
                    aliases: ["double", "doppelt"],
                },
            ],
        },
        {
            name: "borderBottomStyle",
            aliases: ["borderbottomstyle", "umrandungsstil-unten"],
            type: "style",
            append: "",
            values: [
                {
                    name: "none",
                    aliases: ["none", "keine"],
                },
                {
                    name: "solid",
                    aliases: ["solid", "durchgezogen", "solide"],
                },
                {
                    name: "dashed",
                    aliases: ["dashed", "gestrichen"],
                },
                {
                    name: "dotted",
                    aliases: ["dotted", "gepunktet"],
                },
                {
                    name: "double",
                    aliases: ["double", "doppelt"],
                },
            ],
        },
        {
            name: "borderLeftStyle",
            aliases: ["borderleftstyle", "umrandungsstil-links"],
            type: "style",
            append: "",
            values: [
                {
                    name: "none",
                    aliases: ["none", "keine"],
                },
                {
                    name: "solid",
                    aliases: ["solid", "durchgezogen", "solide"],
                },
                {
                    name: "dashed",
                    aliases: ["dashed", "gestrichen"],
                },
                {
                    name: "dotted",
                    aliases: ["dotted", "gepunktet"],
                },
                {
                    name: "double",
                    aliases: ["double", "doppelt"],
                },
            ],
        },
        {
            name: "borderStyle",
            aliases: ["borderstyle", "umrandungsstil"],
            type: "style",
            append: "",
            values: [
                {
                    name: "none",
                    aliases: ["none", "keine"],
                },
                {
                    name: "solid",
                    aliases: ["solid", "durchgezogen", "solide"],
                },
                {
                    name: "dashed",
                    aliases: ["dashed", "gestrichen"],
                },
                {
                    name: "dotted",
                    aliases: ["dotted", "gepunktet"],
                },
                {
                    name: "double",
                    aliases: ["double", "doppelt"],
                },
            ],
        },
        {
            name: "borderRadius",
            aliases: ["borderradius", "umrandungsradius"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "borderTopLeftRadius",
            aliases: ["bordertopleftradius", "umrandungsradius-oben-links"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "borderTopRightRadius",
            aliases: ["bordertoprightradius", "umrandungsradius-oben-rechts"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "borderBottomLeftRadius",
            aliases: ["borderbottomleftradius", "umrandungsradius-unten-links"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "borderBottomRightRadius",
            aliases: ["borderbottomrightradius", "umrandungsradius-unten-rechts"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "borderTopLeftRadius",
            aliases: ["bordertopleftradius", "umrandungsradius-oben-links"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "borderTopRightRadius",
            aliases: ["bordertoprightradius", "umrandungsradius-oben-rechts"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "borderBottomLeftRadius",
            aliases: ["borderbottomleftradius", "umrandungsradius-unten-links"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "borderBottomRightRadius",
            aliases: ["borderbottomrightradius", "umrandungsradius-unten-rechts"],
            type: "style",
            append: "px",
            values: [],
        },
        {
            name: "borderTopColor",
            aliases: ["bordertopcolor", "umrandungsfarbe-oben"],
            type: "style",
            append: "",
            values: SetCommand.colors,
        },
        {
            name: "borderRightColor",
            aliases: ["borderrightcolor", "umrandungsfarbe-rechts"],
            type: "style",
            append: "",
            values: SetCommand.colors,
        },
        {
            name: "borderBottomColor",
            aliases: ["borderbottomcolor", "umrandungsfarbe-unten"],
            type: "style",
            append: "",
            values: SetCommand.colors,
        },
        {
            name: "borderLeftColor",
            aliases: ["borderleftcolor", "umrandungsfarbe-links"],
            type: "style",
            append: "",
            values: SetCommand.colors,
        },
        {
            name: "borderColor",
            aliases: ["bordercolor", "umrandungsfarbe"],
            type: "style",
            append: "",
            values: SetCommand.colors,
        },
        {
            name: "display",
            aliases: ["display", "sichtbarkeit"],
            type: "style",
            append: "",
            values: [
                {
                    name: "none",
                    aliases: ["invisible", "unsichtbar"],
                },
                {
                    name: "block",
                    aliases: ["block", "sichtbar"],
                },
            ],
        },
    ];
    return SetCommand;
}());
exports.default = SetCommand;
//# sourceMappingURL=SetCommand.js.map