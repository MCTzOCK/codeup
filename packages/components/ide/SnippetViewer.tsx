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
import { CHeading } from "../global/CHeading";
import { useTranslation } from "next-i18next";

export default function SnippetViewer(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation("snippets-viewer");

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
          <DrawerHeader>{t("snippets")}</DrawerHeader>

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
                  placeholder={t("search")}
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
                        <CHeading size={"lg"}>{snippet.title}</CHeading>
                        <Text ml={"auto"}>
                          {new Date(snippet.createdAt).toLocaleString()}
                        </Text>
                      </Flex>
                      <Text mb={"2rem"}>
                        <chakra.span color={"brand.500"}>
                          {snippet.language}
                        </chakra.span>
                      </Text>
                      <p>
                        <pre>
                          <code>{snippet.code}</code>
                        </pre>
                      </p>
                      <ButtonGroup mt={"2rem"}>
                        <Button
                          variant={"brand"}
                          leftIcon={<FaCopy />}
                          onClick={() => {
                            try {
                              navigator.clipboard.writeText(snippet.code);
                              toast({
                                title: t("code.copied"),
                                description: t("code.copied.text"),
                                status: "success",
                                duration: 1500,
                                isClosable: false,
                                position: "bottom-right",
                              });
                            } catch (e) {
                              toast({
                                title: t("base:control.error"),
                                description: t("code.copied.error"),
                                status: "error",
                                duration: 1500,
                                isClosable: false,
                                position: "bottom-right",
                              });
                            }
                          }}
                        >
                          {t("copy")}
                        </Button>
                      </ButtonGroup>
                    </GridItem>
                  </>
                ))}
            </Grid>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={props.onClose}>
              {t("close")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
