/**
 * packages/components/editorv2/uml/UMLEditor.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.06.2024
 *
 */

import * as React from "react";
import { IUMLDiagram } from "@codeup/web/src/types/IUMLDiagram";
import AuthenticateLoadingIndicator from "../../admin/AuthenticateLoadingIndicator";
import { Text } from "@chakra-ui/react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useRef, useState } from "react";
import { editor } from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import { uml_language_config, uml_language } from "@codeup/util/src/monaco/uml";

export default function UMLEditor(props: {
  uml: IUMLDiagram;
  updateUML: (uml: IUMLDiagram) => void;
}) {
  const monaco = useMonaco();
  const [monacoTheme, setMonacoTheme] = useState("vs-dark");
  const [monacoLanguage, setMonacoLanguage] = useState("html");

  const editorRef = useRef<IStandaloneCodeEditor>();

  React.useEffect(() => {
    if (monaco && monaco.editor) {
      monaco.editor.defineTheme("codeup-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          {
            token: "keyword",
            foreground: "#F7DE1F",
          },
          {
            token: "string",
            foreground: "#FF6400",
          },
        ],
        colors: {
          "editor.background": "#000000",
        },
      });

      setMonacoTheme("codeup-dark");

      monaco.languages.register({
        id: "plantuml",
      });

      monaco.languages.setMonarchTokensProvider("plantuml", uml_language);
      monaco.languages.setLanguageConfiguration(
        "plantuml",
        uml_language_config
      );
    }
  }, [monaco]);

  if (!props.uml) {
    return (
      <>
        <AuthenticateLoadingIndicator text={"Lade UML Diagramm..."} />
      </>
    );
  }

  if (props.uml.type === "adv") {
    return (
      <>
        <Editor
          defaultLanguage={"plantuml"}
          defaultValue={
            JSON.parse(props.uml.data).content || "@startuml\n\n@enduml"
          }
          onMount={(e) => {
            editorRef.current = e;
          }}
          onChange={(e) => {
            props.updateUML({
              ...props.uml,
              data: JSON.stringify({
                content: e,
              }),
            });
          }}
          theme={monacoTheme}
          options={{
            fontSize: 22,
            wrappingIndent: "indent",
            insertSpaces: true,
          }}
          height={"90vh"}
        />
      </>
    );
  }

  return (
    <>
      <Text>Dieser Diagrammtyp wird aktuell nicht unterstützt!</Text>
    </>
  );
}
