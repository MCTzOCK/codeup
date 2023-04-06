/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

export class AliasManager {
  public static readonly CMD_ALIASES = [
    ["@", "📜"],
    ["//", "#", "📖"],
    ["create", "erstelle", "definiere", "define", "➕"],
    ["call", "execute", "rufe"],
    ["add", "füge"],
    ["remove", "entferne"],
    ["repeat", "wiederhole", "🔁"],
    ["print", "gib"],
    ["ask", "frage", "❓"],
    ["if", "wenn", "falls"],
    ["else", "sonst"],
    ["wait", "warte", "⌛"],
    ["set", "setze"],
  ];

  public static readonly SPECIAL_ALIASES = [["value", "wert"]];

  public static readonly TYPE_ALIASES = [
    ["button", "knopf"],
    ["p", "paragraph", "absatz"],
    ["span", "text"],
    ["img", "image", "bild"],
    ["h1", "heading1", "überschrift1"],
    ["h2", "heading2", "überschrift2"],
    ["h3", "heading3", "überschrift3"],
    ["h4", "heading4", "überschrift4"],
    ["h5", "heading5", "überschrift5"],
    ["h6", "heading6", "überschrift6"],
    ["table", "tabelle"],
    ["tr", "row", "zeile"],
    ["tb", "column", "spalte"],
    ["br", "linebreak", "zeilenumbruch"],
    ["video"],
    ["audio", "ton"],
    ["iframe", "frame", "fenster"],
    ["div", "container"],
    ["li", "listitem", "listenpunkt"],
    ["ol", "ordered-list", "geordnete-liste"],
    ["ul", "unordered-list", "ungeordnete-liste"],
    ["a", "link"],
    ["function", "method", "methode", "funktion"],
    ["document.body", "screen", "bildschirm"],
    ["console.log", "console", "konsole"],
    ["alert", "dialogbox"],
    ["key", "taste"],
  ];

  public static readonly OPERATOR_ALIASES = [
    ["<", "kleiner", "smaller"],
    [">", "größer"],
    ["===", "gleich", "equals"],
    ["!==", "ungleich", "unequal"],
    [">=", "größergleich", "greaterequal"],
    ["<=", "kelinergleich", "smallerequal"],
  ];

  public static readonly EVENT_ALIASES = [
    ["click", "pressed", "gedrückt"],
    ["mouseover", "hovered", "berührt"],
    ["mouseleave", "not-hovered", "nicht-berührt"],
  ];

  public static readonly COLOR_PROPERTY_ALIASES = [
    ["style.color", "color", "farbe"],
    ["style.backgroundColor", "backgroundcolor", "hintergrundfarbe"],
    ["blue", "blau"],
    ["lime", "green", "grün"],
    ["red", "rot"],
    ["orange"],
    ["yellow", "gelb"],
    ["white", "weiß"],
    ["black", "schwarz"],
    ["grey", "grau"],
    ["purple", "lila"],
    ["pink", "pink"],
    ["brown", "braun"],
    ["cyan", "cyan"],
    ["magenta", "magenta"],
    ["maroon", "maroon"],
    ["navy", "navy"],
    ["olive", "olive"],
    ["silver", "silber"],
    ["teal", "teal"],
    ["transparent", "transparent"],
  ];

  public static getCommandAliases(command: string): string[] {
    return (
      AliasManager.CMD_ALIASES.find((alias) =>
        alias.includes(command.toLowerCase())
      ) || []
    );
  }

  public static getTypeAliases(type: string): string[] {
    return (
      AliasManager.TYPE_ALIASES.find((alias) =>
        alias.includes(type.toLowerCase())
      ) || []
    );
  }

  public static getOperatorAliases(operator: string): string[] {
    return (
      AliasManager.OPERATOR_ALIASES.find((alias) =>
        alias.includes(operator.toLowerCase())
      ) || []
    );
  }

  public static getEventAliases(event: string): string[] {
    return (
      AliasManager.EVENT_ALIASES.find((alias) =>
        alias.includes(event.toLowerCase())
      ) || []
    );
  }

  public static getColorPropertyAliases(colorProperty: string): string[] {
    return (
      AliasManager.COLOR_PROPERTY_ALIASES.find((alias) =>
        alias.includes(colorProperty.toLowerCase())
      ) || []
    );
  }

  public static getSpecialAliases(special: string): string[] {
    return (
      AliasManager.SPECIAL_ALIASES.find((alias) =>
        alias.includes(special.toLowerCase())
      ) || []
    );
  }
}
