/**
 * apps/web/src/pages/ideas/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.12.2022
 *
 */

import * as React from "react";
import { useEffect } from "react";
import { useLoggedIn } from "@codeup/hooks";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import REST from "@codeup/rest";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { Card, CardBody, CardFooter } from "@chakra-ui/card";
import { useRouter } from "next/router";
import Head from "next/head";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import { translateOnlineV3 } from "../../global/i18n/onlineTranslateV3";

export default function Viewer() {
  const [projectIdeas, setProjectIdeas] = React.useState<
    {
      _id: string;
      title: string;
      description: string;
      exampleDeployedURL?: string;
      exampleSourceURL?: string;
      level: string;
    }[]
  >([]);

  const { t } = useTranslation("ideas");

  const [filteredProjectIdeas, setFilteredProjectIdeas] = React.useState<
    {
      _id: string;
      title: string;
      description: string;
      exampleDeployedURL?: string;
      exampleSourceURL?: string;
      level: string;
    }[]
  >([]);

  const toast = useToast();
  const router = useRouter();

  const reload = () => {
    REST.Ideas.getProjectIdeas().then(async (res) => {
      if (res.status === 200) {
        if (router.locale === "de") {
          setProjectIdeas(res.payload.ideas);
          setFilteredProjectIdeas(res.payload.ideas);
        } else {
          let pI: any[] = [];

          for await (const i of res.payload.ideas) {
            pI.push({
              ...i,
              title: await translateOnlineV3({
                text: i.title,
                to: "en",
                from: "de",
              }),
              description: await translateOnlineV3({
                text: i.description,
                to: "en",
                from: "de",
              }),
            });
          }

          setProjectIdeas(pI);
          setFilteredProjectIdeas(pI);
        }
      } else {
        toast({
          title: t("base:control.error"),
          description: t("error.text") + ": " + res.payload.error,
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "bottom-right",
        });
      }
    });
  };

  useEffect(() => {
    reload();
  }, []);

  const [query, setQuery] = React.useState<string>("");

  useEffect(() => {
    setFilteredProjectIdeas(
      projectIdeas.filter((idea) =>
        idea.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query]);

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      <Box bg={"#000"} h={"fit-content"} minH={"100vh"}>
        <Flex
          w={"100%"}
          pt={"2rem"}
          alignItems={"center"}
          justifyContent={"center"}
          direction={"column"}
        >
          <Box textAlign={"center"} pt={4}>
            <CHeading size={"2xl"}>{t("title")}</CHeading>
          </Box>
          <Input
            placeholder={t("search")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            w={"50%"}
            mt={"2rem"}
          />
        </Flex>
        <Grid
          templateColumns={
            filteredProjectIdeas.length > 0
              ? [
                  "repeat(1, 1fr)",
                  "repeat(2, 1fr)",
                  "repeat(3, 1fr)",
                  "repeat(4, 1fr)",
                  "repeat(5, 1fr)",
                ]
              : "repeat(1, 1fr)"
          }
          gap={6}
          p={10}
        >
          {filteredProjectIdeas.map((idea) => (
            <>
              <Card
                maxW="sm"
                h={"100%"}
                bgColor={"gray.900"}
                rounded={"xl"}
                boxShadow={"xl"}
                p={5}
                id={"_card_" + idea._id}
              >
                <CardBody>
                  <Stack mt={2} spacing="3">
                    <Heading size="md">{idea.title}</Heading>
                    <Badge
                      w={"100%"}
                      fontSize={"lg"}
                      colorScheme={
                        idea.level === "easy"
                          ? "green"
                          : idea.level === "medium"
                          ? "yellow"
                          : "red"
                      }
                    >
                      {idea.level === "easy"
                        ? t("idea.easy")
                        : idea.level === "medium"
                        ? t("idea.medium")
                        : t("idea.hard")}
                    </Badge>
                    <Text>{idea.description}</Text>
                  </Stack>
                </CardBody>
                <CardFooter mt={4}>
                  <ButtonGroup spacing="2">
                    {idea.exampleDeployedURL &&
                    idea.exampleDeployedURL !== "" ? (
                      <>
                        <Button
                          variant={"brand"}
                          onClick={() => {
                            window.open(idea.exampleDeployedURL, "_blank");
                          }}
                        >
                          {t("example")}
                        </Button>
                      </>
                    ) : null}
                    {idea.exampleSourceURL && idea.exampleSourceURL !== "" ? (
                      <>
                        <Button
                          variant="ghost"
                          colorScheme="brand"
                          onClick={() => {
                            window.open(idea.exampleSourceURL, "_blank");
                          }}
                        >
                          {t("code")}
                        </Button>
                      </>
                    ) : null}
                  </ButtonGroup>
                </CardFooter>
              </Card>
            </>
          ))}
          {filteredProjectIdeas.length === 0 ? (
            <>
              <Text
                textAlign={"center"}
                fontSize={"2xl"}
                color={"gray.500"}
                mt={4}
              >
                {t("no.ideas.found")}
              </Text>
            </>
          ) : null}
        </Grid>
      </Box>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["ideas"])),
  };
}
