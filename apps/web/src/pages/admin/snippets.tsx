/**
 * apps/web/src/pages/admin/snippets.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.04.2023
 *
 */

import * as React from "react";
import AdminLayout from "@codeup/components/dist/admin/AdminLayout";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import REST from "@codeup/rest/src";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import CodeUpModal from "@codeup/components/dist/codeup/CodeUpModal";
import Editor from "@monaco-editor/react";
import {
  FaClock,
  FaCode,
  FaCopy,
  FaFile,
  FaPen,
  FaPlus,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import GridLayout from "@codeup/components/dist/global/GridLayout";
import SuperText from "@codeup/components/dist/landingpage/SuperText";

export default function Snippets() {
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

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    REST.Admin.getSnippets(localStorage.getItem("token") as string).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          setSnippets(res.payload.snippets);
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

  return (
    <>
      <AdminLayout>
        {loading ? (
          <>
            <AuthenticateLoadingIndicator text={"Lade Snippets..."} />
          </>
        ) : (
          <>
            {error ? (
              <>
                <ErrorComponent
                  description={
                    "Beim Laden der Snippets ist ein Fehler aufgetreten."
                  }
                />
              </>
            ) : (
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
                                description:
                                  "Das Snippet wurde erfolgreich gelöscht",
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
                <Box mt={6}></Box>
                <SuperText>Code Snippets</SuperText>

                <GridLayout
                  search={{
                    allow: true,
                    searchFields: true,
                  }}
                  specialEntries={[]}
                  entries={snippets.map((snippet) => {
                    return {
                      title: snippet.title,
                      fields: [
                        {
                          icon: <FaUser />,
                          text: "Besitzer: @" + snippet.username,
                        },
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
                        {
                          buttons: [
                            {
                              icon: <FaPen />,
                              text: "Bearbeiten",
                              colorScheme: "blue",
                              onClick: async () => {
                                setCurrentSnippet(snippet);
                                onOpen();
                              },
                            },
                            {
                              icon: <FaCopy />,
                              text: "Kopieren",
                              colorScheme: "green",
                              onClick: async () => {
                                navigator.clipboard.writeText(snippet.code);
                                toast({
                                  title: "Code kopiert",
                                  description:
                                    "Der Code wurde erfolgreich kopiert",
                                  status: "success",
                                  duration: 1500,
                                  isClosable: false,
                                  position: "bottom-right",
                                });
                              },
                            },
                          ],
                        },
                      ],
                    };
                  })}
                />
              </>
            )}
          </>
        )}
      </AdminLayout>
    </>
  );
}
