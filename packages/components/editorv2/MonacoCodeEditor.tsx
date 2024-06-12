/**
 * packages/components/editorv2/MonacoCodeEditor.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.06.2024
 *
 */

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { editor } from "monaco-editor";
import IStandaloneThemeData = editor.IStandaloneThemeData;
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import Editor, { useMonaco } from "@monaco-editor/react";

export default function MonacoCodeEditor(props: {
  fileName: string;
  content: string;
  updateContent: (v: string) => void;
}) {
  const [language, setLanguage] = useState<string>("javascript");
  const [monacoTheme, setMonacoTheme] = useState<string>("vs-dark");
  const editorRef = useRef<IStandaloneCodeEditor>();
  const monaco = useMonaco();

  const extLangMappings: {
    [key: string]: string;
  } = {
    js: "javascript",
    ts: "typescript",
    css: "css",
    html: "html",
    tsx: "typescript",
    json: "json",
  };

  const codeUpDarkTheme: IStandaloneThemeData = {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#141517",
    },
  };

  useEffect(() => {
    if (monaco && monaco.editor) {
      monaco.editor.defineTheme("codeup-dark", codeUpDarkTheme);

      setMonacoTheme("codeup-dark");
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        jsx: monaco.languages.typescript.JsxEmit.React,
      });
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });
    }
  }, [monaco]);

  useEffect(() => {
    if (!monaco || !editorRef.current) return;
    const split = props.fileName.split(".");
    setLanguage(extLangMappings[split[split.length - 1] as string]);
  }, [props.fileName]);

  useEffect(() => {
    if (!monaco || !editorRef.current) return;
    monaco.editor.setModelLanguage(editorRef.current.getModel()!, language);
  }, [language]);

  useEffect(() => {
    if (!monaco || !editorRef.current) return;
    editorRef.current.setValue(props.content);
  }, [props.content, props.fileName]);

  if (!props.fileName || props.fileName === ".codeup.no-editor.empty") {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "90vh",
          }}
        >
          <h1>Keine Datei ausgewählt</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Editor
        defaultLanguage={language}
        defaultValue={""}
        onMount={(e) => {
          editorRef.current = e;
        }}
        onChange={(e) => {
          props.updateContent(e as string);
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
