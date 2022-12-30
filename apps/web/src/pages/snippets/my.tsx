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
import { FaCopy, FaPen, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import REST from "@codeup/rest";
import Editor from "@monaco-editor/react";
import CodeUpModal from "@codeup/components/dist/codeup/CodeUpModal";

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
          <Heading
            fontSize={["3xl", "6xl"]}
            color={"white"}
            textAlign={"center"}
            fontWeight={"bold"}
            fontFamily={"Seymour One"}
            textShadow={"0px 10px 100px #000000"}
            m={8}
          >
            Code Snippets
          </Heading>
          <Flex w={"100%"} alignItems={"center"} justifyContent={"center"}>
            <InputGroup w={["75%", "25%"]}>
              <InputLeftElement>
                <FaSearch />
              </InputLeftElement>
              <Input
                placeholder={"Suche"}
                onChange={(e) => {
                  setQuery(e.currentTarget.value);
                }}
              />
            </InputGroup>
          </Flex>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
            gap={"2rem"}
            p={8}
          >
            <GridItem
              key={"new"}
              bg={"gray.900"}
              p={"1rem"}
              borderRadius={"0.5rem"}
              _hover={{
                cursor: "pointer",
                borderColor: "blue.300",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
              onClick={() => {
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
              }}
            >
              <Heading
                fontSize={"8xl"}
                textAlign={"center"}
                color={"blue.300"}
                alignItems={"center"}
                justifyContent={"center"}
                display={"flex"}
                h={"100%"}
              >
                <FaPlus />
              </Heading>
            </GridItem>

            {filteredSnippets.map((snippet) => (
              <>
                <GridItem
                  key={snippet._id}
                  bg={"gray.900"}
                  p={"1rem"}
                  borderRadius={"0.5rem"}
                  cursor={"pointer"}
                >
                  <Flex alignItems={"center"}>
                    <Heading size={"lg"}>{snippet.title}</Heading>
                    <Text ml={"auto"}>
                      {new Date(snippet.createdAt).toLocaleString()}
                    </Text>
                  </Flex>
                  <Text mb={"2rem"}>
                    <chakra.span color={"blue.300"}>
                      {snippet.language}
                    </chakra.span>
                  </Text>
                  <p>{snippet.code.substring(0, 200)}</p>
                  <ButtonGroup mt={"2rem"}>
                    <Button
                      colorScheme={"blue"}
                      leftIcon={<FaPen />}
                      onClick={() => {
                        setCurrentSnippet(snippet);
                        onOpen();
                      }}
                    >
                      Bearbeiten
                    </Button>
                    <Button
                      colorScheme={"green"}
                      leftIcon={<FaCopy />}
                      onClick={() => {
                        navigator.clipboard.writeText(snippet.code);
                        toast({
                          title: "Code kopiert",
                          description: "Der Code wurde erfolgreich kopiert",
                          status: "success",
                          duration: 1500,
                          isClosable: false,
                          position: "bottom-right",
                        });
                      }}
                    >
                      Kopieren
                    </Button>
                  </ButtonGroup>
                </GridItem>
              </>
            ))}
          </Grid>
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
                  <Flex
                    w={"100%"}
                    h={"100vh"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    direction={"column"}
                  >
                    <CircularProgress
                      size={"80px"}
                      isIndeterminate
                      color="red.300"
                    />
                    <Heading size={"lg"} mt={4}>
                      Anmelden ...
                    </Heading>
                  </Flex>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
