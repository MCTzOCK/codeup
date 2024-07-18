/**
 * apps/web/src/pages/snippets/my.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.12.2022
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  FaClock,
  FaCode,
  FaCopy,
  FaFile,
  FaPen,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import REST from "@codeup/rest";
import Editor from "@monaco-editor/react";
import CodeUpModal from "@codeup/components/dist/codeup/CodeUpModal";
import GridLayout from "@codeup/components/global/GridLayout";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import GridLayoutV2 from "@codeup/components/global/GridLayoutV2";
import router from "next/router";

export default function MySnippetViewer() {
  const { loggedIn, loaded, userInfo } = useLoggedIn();

  const [snippets, setSnippets] = React.useState<
    {
      _id: string;
      title: string;
      code: string;
      language: string;
      createdAt: string;
      username: string;
    }[]
  >([]);
  const [filteredSnippets, setFilteredSnippets] = React.useState<
    typeof snippets
  >([]);
  const [query, setQuery] = React.useState("");
  const [error, setError] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    if (loaded && loggedIn) {
      reload();
    }
  }, [loaded, loggedIn, userInfo]);

  React.useEffect(() => {
    let q = query;
    q = q.trim();
    setFilteredSnippets(
      snippets.filter(
        (s: any) =>
          s.title.toLowerCase().includes(q.toLowerCase()) ||
          s.code.toLowerCase().includes(q.toLowerCase()) ||
          s.language.toLowerCase().includes(q.toLowerCase())
      )
    );
  }, [query]);

  const reload = () => {
    REST.Snippets.getSnippets(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setSnippets(res.payload.snippets);
          let q = query;
          q = q.trim();
          setFilteredSnippets(
            res.payload.snippets.filter(
              (s: any) =>
                s.title.toLowerCase().includes(q.toLowerCase()) ||
                s.code.toLowerCase().includes(q.toLowerCase()) ||
                s.language.toLowerCase().includes(q.toLowerCase())
            )
          );
        } else {
          setError(true);
        }
      }
    );
  };
  const toast = useToast();

  const [currentSnippet, setCurrentSnippet] = React.useState<{
    _id: string;
    title: string;
    code: string;
    language: string;
    createdAt: string;
    username: string;
  } | null>(null);

  React.useEffect(() => {
    if (snippets.length > 0) {
      if (router && router.query && router.query.sid) {
        const snip = snippets.find((s) => s._id === router.query.sid);
        if (snip) {
          setCurrentSnippet(snip);
          onOpen();
        }
      }
    }
  }, [snippets, router, router.query, router.query.sid]);

  return (
    <>
      {loggedIn && loaded ? (
        <>
          <CodeUpModal
            onOpen={onOpen}
            onClose={onClose}
            isOpen={isOpen}
            title={currentSnippet?.title || "Neues Snippet"}
            noCloseButton
          >
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Titel</FormLabel>
                <Input
                  type={"text"}
                  placeholder={"Titel des Snippets"}
                  value={currentSnippet?.title}
                  onChange={(e) => {
                    if (currentSnippet) {
                      setCurrentSnippet({
                        ...currentSnippet,
                        title: e.target.value as string,
                      });
                    }
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Sprache</FormLabel>
                <Input
                  type={"text"}
                  placeholder={"Sprache des Snippets"}
                  value={currentSnippet?.language}
                  onChange={(e) => {
                    if (currentSnippet) {
                      setCurrentSnippet({
                        ...currentSnippet,
                        language: e.target.value as string,
                      });
                    }
                  }}
                />
              </FormControl>
              <FormControl data-color-mode={"dark"}>
                <FormLabel>Code</FormLabel>
                <Editor
                  height={"50vh"}
                  language={currentSnippet?.language || "javascript"}
                  theme={"vs-dark"}
                  value={currentSnippet?.code}
                  onChange={(value) => {
                    if (currentSnippet) {
                      setCurrentSnippet({
                        ...currentSnippet,
                        code: value as string,
                      });
                    }
                  }}
                />
              </FormControl>
              <ButtonGroup
                display={"flex"}
                justifyContent={"flex-end"}
                w={"100%"}
              >
                <Button
                  leftIcon={<FaTrash />}
                  onClick={() => {
                    REST.Snippets.deleteSnippet({
                      token: localStorage.getItem("token") as string,
                      id: currentSnippet?._id as string,
                    }).then((res) => {
                      if (res.status === 200) {
                        toast({
                          title: "Snippet gelöscht",
                          description: "Das Snippet wurde erfolgreich gelöscht",
                          status: "success",
                          duration: 1500,
                          isClosable: false,
                          position: "bottom-right",
                        });
                        reload();
                        onClose();
                      } else {
                        toast({
                          title: "Fehler",
                          description: res.payload.error,
                          status: "error",
                          duration: 1500,
                          isClosable: false,
                          position: "bottom-right",
                        });
                      }
                    });
                  }}
                >
                  Löschen
                </Button>
                <Button
                  colorScheme={"red"}
                  onClick={() => {
                    onClose();
                  }}
                >
                  Abbrechen
                </Button>
                <Button
                  colorScheme={"green"}
                  onClick={() => {
                    REST.Snippets.updateSnippet({
                      token: localStorage.getItem("token") as string,
                      id: currentSnippet?._id as string,
                      title: currentSnippet?.title as string,
                      code: currentSnippet?.code as string,
                      language: currentSnippet?.language as string,
                    }).then((res) => {
                      if (res.status === 200) {
                        reload();
                        onClose();
                        setCurrentSnippet(null);
                      } else {
                        toast({
                          title: "Fehler",
                          description: res.payload.error,
                          status: "error",
                          duration: 1500,
                          isClosable: false,
                          position: "bottom-right",
                        });
                      }
                    });
                  }}
                >
                  Speichern
                </Button>
              </ButtonGroup>
            </Stack>
          </CodeUpModal>
          <Box bg={"#000"} h={"fit-content"} minH={"100vh"}>
            <GridLayoutV2
              search={{
                show: true,
                fields: true,
              }}
              entries={snippets.map((snippet) => {
                return {
                  title: snippet.title,
                  fields: [
                    {
                      icon: <FaCode />,
                      text: snippet.language,
                    },
                    {
                      icon: <FaClock />,
                      text: new Date(snippet.createdAt).toLocaleString(),
                    },
                    {
                      icon: <FaFile />,
                      text: snippet.code.substring(0, 50) + "...",
                    },
                  ],
                  buttonRows: [
                    [
                      {
                        text: "Bearbeiten",
                        onClick: async () => {
                          setCurrentSnippet(snippet);
                          onOpen();
                        },
                        variant: "brand",
                        leftIcon: <FaPen />,
                      },
                      {
                        leftIcon: <FaCopy />,
                        text: "Kopieren",
                        colorScheme: "green",
                        onClick: async () => {
                          await navigator.clipboard.writeText(snippet.code);
                          toast({
                            title: "Code kopiert",
                            description: "Der Code wurde erfolgreich kopiert",
                            status: "success",
                            duration: 1500,
                            isClosable: false,
                            position: "bottom-right",
                          });
                        },
                      },
                    ],
                  ],
                };
              })}
              topButtons={[
                {
                  variant: "brand",
                  text: "Neu",
                  leftIcon: <FaPlus />,
                  onClick: () => {
                    REST.Snippets.createSnippet({
                      title: "Neues Snippet",
                      code: 'console.log("Hello World")',
                      language: "javascript",
                      token: localStorage.getItem("token") as string,
                    }).then((res) => {
                      if (res.status === 200) {
                        reload();
                        onOpen();
                        setCurrentSnippet(res.payload.snippet);
                      } else {
                        toast({
                          title: "Fehler",
                          description: res.payload.error,
                          status: "error",
                          duration: 1500,
                          isClosable: false,
                          position: "bottom-right",
                        });
                      }
                    });
                  },
                },
              ]}
              pageTitle={"CodeSnippets"}
            />
          </Box>
        </>
      ) : (
        <>
          {loaded && !loggedIn ? (
            <>
              <ErrorComponent
                description={
                  "Du musst eingeloggt sein, um diese Seite zu sehen."
                }
              />
            </>
          ) : (
            <>
              {error ? (
                <>
                  <ErrorComponent
                    description={
                      "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut."
                    }
                  />
                </>
              ) : (
                <>
                  <AuthenticateLoadingIndicator />
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
