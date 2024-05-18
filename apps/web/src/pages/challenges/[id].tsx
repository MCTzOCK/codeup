/**
 * apps/web/src/pages/challenges/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.05.2024
 *
 */

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import redirect from "@codeup/util/dist/userworkflow/redirect";
import {
  Box,
  Button,
  Flex,
  Select,
  chakra,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { useRouter } from "next/router";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import Editor, { useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import { LanguageTemplates } from "../../global/rce/language/LanguageTemplates";
import { FaCheck, FaPlay } from "react-icons/fa";
import { IResponse } from "@codeup/rest/dist/types/IResponse";
import CodeUpModal from "@codeup/components/dist/codeup/CodeUpModal";
import PopupManager from "../../global/PopupManager";

export default function ChallengeViewer() {
  const [challenge, setChallenge] = React.useState<{
    _id: string;
    title: string;
    difficulty: number;
    task: string;
  } | null>(null);
  useEffect(() => {
    redirect({
      forceAnonymous: false,
      allowAnonymous: false,
      redirectToLogin: true,
      redirectTo: "/challenges",
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (!router.query.id) return;

    REST.Challenges.getChallenges(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then((r) => {
      if (r.status === 200) {
        setChallenge(r.payload.challenge);
      } else {
        router.push("/error?error=Die Challenge konnte nicht geladen werden");
      }
    });
  }, [router.query.id]);

  const monaco = useMonaco();
  const [monacoTheme, setMonacoTheme] = useState("vs-dark");
  const [monacoLanguage, setMonacoLanguage] = useState("javascript");

  const editorRef = useRef<IStandaloneCodeEditor>();

  React.useEffect(() => {
    if (monaco && monaco.editor) {
      monaco.editor.defineTheme("codeup-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#141517",
        },
      });

      setMonacoTheme("codeup-dark");
    }
  }, [monaco]);
  React.useEffect(() => {
    if (editorRef && editorRef.current) {
      monaco?.editor.setModelLanguage(
        editorRef.current.getModel() as editor.ITextModel,
        monacoLanguage
      );
      editorRef.current.setValue(
        LanguageTemplates[monacoLanguage as any] as any
      );
    }
  }, [monacoLanguage]);

  const [resultLoading, setResultLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box w={"100%"} h={"fit-content"} minH={"100vh"} bg={"#000"} p={4}>
        {challenge ? (
          <>
            <Box bg={"gray.900"} rounded={"xl"} p={4} maxW={"500px"}>
              <CHeading size={"lg"}>Aufgabe</CHeading>
              <Text>{challenge.task}</Text>
            </Box>
            <Box
              mt={4}
              w={"100%"}
              h={"fit-content"}
              minH={"80vh"}
              bg={"gray.900"}
              rounded={"xl"}
              p={4}
            >
              <Flex alignItems={"center"} gap={4} mb={4}>
                <Select
                  onChange={(e) => setMonacoLanguage(e.target.value)}
                  w={"fit-content"}
                  value={monacoLanguage}
                >
                  {Object.keys(LanguageTemplates).map((lang) => {
                    return (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    );
                  })}
                </Select>
                <Button
                  variant={"brand"}
                  leftIcon={<FaPlay />}
                  onClick={async () => {
                    setResultLoading(true);
                    onOpen();
                    let res: IResponse | null = null;

                    switch (monacoLanguage) {
                      case "javascript":
                        res = await REST.Rce.rceJavaScript(
                          editorRef.current!.getValue(),
                          AccountManager.getActiveToken()
                        );
                        break;
                      case "typescript":
                        res = await REST.Rce.rceTypeScript(
                          editorRef.current!.getValue(),
                          AccountManager.getActiveToken()
                        );
                        break;
                      case "go":
                        res = await REST.Rce.rceGo(
                          editorRef.current!.getValue(),
                          AccountManager.getActiveToken()
                        );
                        break;
                      case "python":
                        res = await REST.Rce.rcePython(
                          editorRef.current!.getValue(),
                          AccountManager.getActiveToken()
                        );
                        break;
                      case "java":
                        res = await REST.Rce.rceJava(
                          editorRef.current!.getValue(),
                          AccountManager.getActiveToken()
                        );
                        break;
                      default:
                        setResultLoading(false);
                        return;
                    }

                    if (res) {
                      setResult(res.payload as any);
                      setResultLoading(false);
                    }
                  }}
                >
                  Ausführen
                </Button>
                <Button
                  variant={"brand"}
                  leftIcon={<FaCheck />}
                  onClick={async () => {
                    if (
                      !(await PopupManager.confirmAsync({
                        title: "Challenge abschließen",
                        question:
                          "Möchtest du deine Lösung wirklich überprüfen?",
                      }))
                    )
                      return;

                    const res = await REST.Challenges.finalCheck(
                      AccountManager.getActiveToken(),
                      challenge._id,
                      editorRef.current!.getValue(),
                      monacoLanguage
                    );

                    if (res.status === 200) {
                      await PopupManager.alertAsync({
                        title: "Challenge abgeschlossen",
                        description:
                          "Deine Lösung wurde erfolgreich überprüft und du hast die Challenge abgeschlossen.",
                      });
                      router.push("/challenges");
                    } else {
                      await PopupManager.alertAsync({
                        title: "Fehler",
                        description: "Deine Lösung war leider nicht korrekt!",
                      });
                    }
                  }}
                >
                  Abschicken
                </Button>
              </Flex>
              <Editor
                defaultValue={LanguageTemplates[monacoLanguage as any] as any}
                defaultLanguage={monacoLanguage}
                onMount={(e) => {
                  editorRef.current = e;
                }}
                onChange={(value, ev) => {}}
                theme={monacoTheme}
                options={{
                  insertSpaces: false,
                  wrappingIndent: "indent",
                  fontSize: 22,
                }}
                height={"80vh"}
              />
            </Box>
          </>
        ) : (
          <>
            <AuthenticateLoadingIndicator text={"Lade Challenge"} />
          </>
        )}
      </Box>
      <CodeUpModal
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        title={"Ausgabe"}
      >
        {resultLoading ? (
          <AuthenticateLoadingIndicator text={"Lade Ausgabe"} />
        ) : (
          <>
            {result &&
              result!.split("\n").map((line, i) => {
                return (
                  <Flex key={i} w={"100%"} gap={2} alignItems={"center"}>
                    <chakra.span color={"gray.400"}>{i + 1}</chakra.span>
                    <Text>{line}</Text>
                  </Flex>
                );
              })}
          </>
        )}
      </CodeUpModal>
    </>
  );
}
