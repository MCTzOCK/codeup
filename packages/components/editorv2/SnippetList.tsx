/**
 * packages/components/editorv2/SnippetList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.06.2024
 *
 */

import * as React from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import {
  Button,
  ButtonGroup,
  chakra,
  Flex,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { FaCopy, FaSearch } from "react-icons/fa";
import { CHeading } from "../global/CHeading";
import { useTranslation } from "next-i18next";

export default function SnippetList() {
  const { t } = useTranslation("projects");
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
    REST.Snippets.getSnippets(AccountManager.getActiveToken()).then((res) => {
      if (res.status === 200) {
        setSnippets(res.payload.snippets);
      } else {
        setError(true);
      }
    });
  }, []);

  const [filteredSnippets, setFilteredSnippets] = React.useState<
    typeof snippets
  >([]);

  const [query, setQuery] = React.useState("");
  return (
    <>
      <Flex w={"100%"} alignItems={"center"} justifyContent={"center"} mb={4}>
        <InputGroup w={"100%"}>
          <InputLeftElement>
            <FaSearch />
          </InputLeftElement>
          <Input
            placeholder={t("base:control.search")}
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
                      } catch (e) {}
                    }}
                  >
                    {t("copy")}
                  </Button>
                </ButtonGroup>
              </GridItem>
            </>
          ))}
      </Grid>
    </>
  );
}
