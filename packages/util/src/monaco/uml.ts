/**
 * packages/util/src/monaco/uml.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.06.2024
 *
 */

export const uml_language: any = {
  keywords: [
    "start",
    "stop",
    "end",
    "participant",
    "actor",
    "usecase",
    "class",
    "interface",
    "abstract",
    "enum",
    "package",
    "node",
    "database",
    "cloud",
    "artifact",
    "folder",
    "frame",
    "rectangle",
    "agent",
    "boundary",
    "control",
    "entity",
    "collections",
    "queue",
    "hexagon",
    "archimate",
    "diamond",
    "component",
    "use",
    "namespace",
    "state",
    "object",
    "as",
    "title",
    "alt",
    "else",
    "opt",
    "loop",
    "par",
    "break",
    "critical",
    "group",
    "note",
    "rnote",
    "hnote",
    "legend",
    "skinparam",
    "left",
    "right",
    "top",
    "bottom",
    "of",
    "on",
    "link",
    "over",
    "endnote",
    "noteend",
    "footer",
    "header",
    "center",
    "rotate",
    "color",
    "background",
    "line",
    "over",
    "include",
    "!define",
    "!undef",
    "!include",
    "!include_many",
    "!include_once",
    "!unlinked",
    "hide",
    "show",
    "skin",
    "return",
    "is",
    "also",
    "label",
    "activate",
    "deactivate",
    "destroy",
    "create",
    "autonumber",
    "fork",
    "again",
    "split",
    "merge",
    "detach",
    "newpage",
    "box",
    "linetype",
    "linestyle",
    "linecolor",
  ],
  operators: ["=", ":", "(", ")", "[", "]", "{", "}", "<", ">"],
  symbols: /[=:\(\)\[\]\{\}<>]/,

  tokenizer: {
    root: [
      // Comments
      [/\/'.*$/, "comment"],
      [/\/'[^\/]*'\/$/, "comment"],
      [/'[^']*$/, "comment"],
      [/'[^']*'/, "comment"],

      // Keywords
      [
        /\b(?:start|stop|end|participant|actor|usecase|class|interface|abstract|enum|package|node|database|cloud|artifact|folder|frame|rectangle|agent|boundary|control|entity|collections|queue|hexagon|archimate|diamond|component|use|namespace|state|object|as|title|alt|else|opt|loop|par|break|critical|group|note|rnote|hnote|legend|skinparam|left|right|top|bottom|of|on|link|over|end\s*note|note\s*end|footer|header|center|rotate|color|background|line|over|include|!define|!undef|!include|!include_many|!include_once|!unlinked|hide|show|skin|return|is|also|label|activate|deactivate|destroy|create|autonumber|else|opt|loop|alt|par|break|critical|group|end|fork|again|split|merge|detach|alt|legend|newpage|box|end|title|participant|actor|boundary|control|entity|database|collections|queue|delay|destroy|footer|header|center|rotate|color|background|linetype|linestyle|linecolor|line:|legend|note|hnote|rnote|line|note|legend|box|end|end|note|note\s*end)\b/,
        "keyword",
      ],

      // Preprocessor
      [/(?:[@]startuml|[@]enduml|!startsub|!endsub)/, "keyword.preprocessor"],

      // Strings
      [/"[^"]*"/, "string"],

      // Delimiters and operators
      [/[{}[\]()<>:=]/, "delimiter"],

      // Numbers
      [/\b\d+\b/, "number"],

      // Identifiers
      [/\b[a-zA-Z_][a-zA-Z0-9_]*\b/, "identifier"],
    ],
  },
};

export const uml_language_config: any = {
  comments: {
    lineComment: "'",
    blockComment: ["'/", "/'"],
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
  ],
};
