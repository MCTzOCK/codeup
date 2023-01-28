/**
 * packages/components/ide/SnippetViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.12.2022
 *
 */

import * as React from "react";
import {
  Button,
  ButtonGroup,
  chakra,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import REST from "@codeup/rest";
import { FaCopy, FaSearch } from "react-icons/fa";

export default function SnippetViewer(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [snippets, setSnippets] = React.useState<
    {
      _id: string;
      title: string;
      code: string;
      language: string;
      createdAt: string;
    }[]
  >([]);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    REST.Snippets.getSnippets(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setSnippets(res.payload.snippets);
        } else {
          setError(true);
        }
      }
    );
  }, []);

  const [filteredSnippets, setFilteredSnippets] = React.useState<
    typeof snippets
  >([]);

  const [query, setQuery] = React.useState("");

  const toast = useToast();

  return (
    <>
      <Drawer
        isOpen={props.isOpen}
        placement="left"
        onClose={props.onClose}
        size={["full", "lg"]}
      >
        <DrawerOverlay />
        <DrawerContent bgColor={"gray.900"}>
          <DrawerCloseButton />
          <DrawerHeader>Code Snippets</DrawerHeader>

          <DrawerBody>
            <Flex
              w={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
              mb={4}
            >
              <InputGroup w={"100%"}>
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
            <Grid templateColumns={"repeat(1, 1fr)"} gap={6}>
              {snippets
                .filter((s) => {
                  return (
                    s.title.toLowerCase().includes(query.toLowerCase()) ||
                    s.code.toLowerCase().includes(query.toLowerCase()) ||
                    s.language.toLowerCase().includes(query.toLowerCase())
                  );
                })
                .map((snippet) => (
                  <>
                    <GridItem
                      key={snippet._id}
                      bg={"gray.800"}
                      p={"1rem"}
                      borderRadius={"0.5rem"}
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
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={props.onClose}>
              Schließen
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
