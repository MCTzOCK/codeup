/**
 * packages/components/dashboard/DV2SSnippets.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.07.2024
 *
 */

import * as React from "react";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import {
  Badge,
  Button,
  Flex,
  Grid,
  Image,
  Progress,
  Text,
} from "@chakra-ui/react";
import { CHeading } from "../global/CHeading";
import router from "next/router";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useTranslation } from "next-i18next";

export default function DV2SSnippets() {
  const { t } = useTranslation("dashboard");
  const [snippets, setSnippets] = React.useState<
    {
      _id: string;
      username: string;
      code: string;
      createdAt: string;
      language: string;
      title: string;
      __v: number;
    }[]
  >([]);
  const [error, setError] = React.useState<string>("");

  useEffect(() => {
    reloadSnippets();
  }, []);

  const reloadSnippets = async () => {
    const res = await REST.Snippets.getSnippets(
      AccountManager.getActiveToken()
    );

    if (res.status !== 200) {
      setError(t("snippets.loading.error") + ": " + res.payload.error);
      return;
    }

    setSnippets(res.payload.snippets);
  };

  return (
    <>
      {error ? (
        <>
          <Flex justifyContent={"center"} p={4}>
            {error}
          </Flex>
        </>
      ) : (
        <>
          <CHeading size={"lg"} mb={4}>
            {t("snippets.title")}
          </CHeading>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
            ]}
            gap={6}
            p={2}
          >
            {snippets.map((snippet) => {
              return (
                <Flex
                  key={snippet._id}
                  bg={"gray.700"}
                  rounded={"md"}
                  p={4}
                  direction={"column"}
                  cursor={"pointer"}
                  onClick={() => {
                    router.push(`/snippets/my?sid=${snippet._id}`);
                  }}
                >
                  <Flex direction={"row"} mt={2}>
                    <Flex direction={"column"} ml={4} justifyContent={"center"}>
                      <CHeading size={"md"}>{snippet.title}</CHeading>
                      <Text fontSize={"lg"}>
                        {new Date(snippet.createdAt).toLocaleString()}
                      </Text>
                      <Text fontSize={"lg"}>
                        {snippet.code.split("\n").length} {t("snippets.lines")}
                      </Text>
                      <Badge variant={"brand"} mt={1.5} w={"fit-content"}>
                        {snippet.language}
                      </Badge>
                    </Flex>
                  </Flex>
                </Flex>
              );
            })}
          </Grid>
          {snippets.length === 0 && (
            <Flex
              justifyContent={"center"}
              p={4}
              direction={"column"}
              gap={4}
              mt={-4}
            >
              <Text>{t("snippets.no.entries")}</Text>
              <Button
                variant={"brand"}
                leftIcon={<FaExternalLinkAlt />}
                w={"fit-content"}
                onClick={() => {
                  router.push("/snippets/my");
                }}
              >
                {t("snippets.new")}
              </Button>
            </Flex>
          )}
        </>
      )}
    </>
  );
}
