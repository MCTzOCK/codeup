/**
 * apps/web/src/pages/search.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.12.2024
 *
 */

import * as React from "react";
import { useEffect } from "react";
import { sProp } from "../global/i18nstaticProps";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import {
  RiGitRepositoryFill,
  RiGitRepositoryPrivateFill,
} from "react-icons/ri";
import DeferredPostCardV2 from "@codeup/components/dist/forum/DeferredPostCardV2";
import PostCardV2 from "@codeup/components/dist/forum/PostCardV2";
import { Pagination } from "@mantine/core";

export default function Search() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const [query, setQuery] = React.useState<string>("");
  const [selectedModel, setSelectedModel] = React.useState<
    "user" | "repository" | "course" | "post"
  >("user");

  const [data, setData] = React.useState<any[]>([]);
  const [maxPage, setMaxPage] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0);

  const { t } = useTranslation("search");

  useEffect(() => {
    if (query === "") return;
    (async () => {
      const res = await REST.search(
        selectedModel,
        query,
        0,
        AccountManager.getActiveToken()
      );
      if (res.status !== 200) {
        setData([]);
        setMaxPage(0);
        setPage(0);
        return;
      }

      setData(res.payload.data);
      setMaxPage(res.payload.maxPage);
      setPage(0);
    })();
  }, [query, selectedModel]);

  useEffect(() => {
    if (query === "") return;
    (async () => {
      const res = await REST.search(
        selectedModel,
        query,
        page,
        AccountManager.getActiveToken()
      );
      if (res.status !== 200) {
        setData([]);
        setMaxPage(0);
        setPage(0);
        return;
      }

      setData(res.payload.data);
      setMaxPage(res.payload.maxPage);
    })();
  }, [page]);

  return (
    <>
      <Head>
        <title>{t("page.title")}</title>
      </Head>
      <Box w={"100%"} minH={"100vh"} bg={"#000"}>
        <Flex
          w={"100%"}
          h={"fit-content"}
          p={4}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Box
            bg={"gray.900"}
            p={4}
            rounded={"lg"}
            w={{
              base: "100%",
              md: "80%",
            }}
          >
            <HStack spacing={4}>
              <InputGroup>
                <InputLeftElement>
                  <FaSearch />
                </InputLeftElement>
                <Input
                  placeholder={t("base:control.search")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </InputGroup>
            </HStack>
            <HStack overflowX={"scroll"} mt={4}>
              <Button
                w={"100%"}
                variant={selectedModel === "user" ? "brand" : "outline"}
                onClick={() => setSelectedModel("user")}
              >
                {t("model.user")}
              </Button>
              <Button
                w={"100%"}
                variant={selectedModel === "repository" ? "brand" : "outline"}
                onClick={() => setSelectedModel("repository")}
              >
                {t("model.repository")}
              </Button>
              <Button
                w={"100%"}
                variant={selectedModel === "course" ? "brand" : "outline"}
                onClick={() => setSelectedModel("course")}
              >
                {t("model.course")}
              </Button>
              <Button
                w={"100%"}
                variant={selectedModel === "post" ? "brand" : "outline"}
                onClick={() => setSelectedModel("post")}
              >
                {t("model.post")}
              </Button>
            </HStack>
            {selectedModel === "user" && (
              <>
                <Stack mt={4} spacing={4}>
                  {data.map((user) => (
                    <>
                      <HStack
                        spacing={4}
                        rounded={"md"}
                        p={2}
                        bg={"gray.700"}
                        cursor={"pointer"}
                        as={"a"}
                        href={"/u/" + user.username}
                      >
                        <Avatar
                          size={"md"}
                          name={`${user.firstName} ${user.lastName}`}
                          src={"/api/account/" + user.username + "/picture"}
                        />
                        <Stack>
                          <Heading size={"md"}>
                            {user.firstName} {user.lastName}
                          </Heading>
                          <Text color={"gray"}>@{user.username}</Text>
                        </Stack>
                      </HStack>
                    </>
                  ))}
                </Stack>
              </>
            )}
            {selectedModel === "repository" && (
              <>
                <Stack mt={4} spacing={4}>
                  {data.map((repo) => (
                    <>
                      <HStack
                        spacing={4}
                        rounded={"md"}
                        p={2}
                        bg={"gray.700"}
                        cursor={"pointer"}
                        as={"a"}
                        href={"/u/" + repo.username + "/" + repo.name}
                      >
                        <Text fontSize={"4xl"}>
                          {repo.public ? (
                            <RiGitRepositoryFill />
                          ) : (
                            <RiGitRepositoryPrivateFill />
                          )}
                        </Text>
                        <Box
                          as={"a"}
                          href={"/u/" + repo.username + "/" + repo.name}
                        >
                          <Heading size={"lg"}>
                            @{repo.username}/{repo.name}
                          </Heading>
                          <Text>{repo.description}</Text>
                        </Box>
                      </HStack>
                    </>
                  ))}
                </Stack>
              </>
            )}
            {selectedModel === "course" && (
              <>
                <Stack mt={4} spacing={4}>
                  {data.map((course) => (
                    <>
                      <HStack
                        spacing={4}
                        rounded={"md"}
                        p={2}
                        bg={"gray.700"}
                        cursor={"pointer"}
                        as={"a"}
                        href={"/course/" + course.friendlyName}
                      >
                        <Image src={course.splashImage} maxW={"100px"} />
                        <Box as={"a"}>
                          <Heading size={"lg"}>{course.name}</Heading>
                          <Text>{course.description}</Text>
                        </Box>
                      </HStack>
                    </>
                  ))}
                </Stack>
              </>
            )}
            {selectedModel === "post" && (
              <>
                <Stack mt={4} spacing={4}>
                  {data.map((post) => (
                    <>
                      <PostCardV2
                        post={post}
                        postOwner={false}
                        reloadPosts={() => {}}
                        userId={post.user}
                        profile={{
                          username: post.username,
                          displayName: "",
                          verified: post.username === "ben.sbrt",
                        }}
                      />
                    </>
                  ))}
                </Stack>
              </>
            )}
            <Flex justifyContent={"center"} alignItems={"center"} mt={4}>
              <Pagination
                color={"#F7DE1F"}
                total={maxPage + 1}
                value={page + 1}
                onChange={(a) => {
                  setPage(a - 1);
                }}
              />
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["search", "forum"])),
  };
}
