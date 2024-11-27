/**
 * apps/web/src/pages/u/[username].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.11.2024
 *
 */

import * as React from "react";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from "@chakra-ui/react";
import REST from "@codeup/rest/src";
import { useEffect } from "react";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import UserPostList from "@codeup/components/forum/UserPostList";
import UserPageRepositoryList from "@codeup/components/v2/UserPageRepositoryList";
import UserPageCertificates from "@codeup/components/v2/UserPageCertificates";
import { useLoggedIn, useUserLoggedInRedirect } from "@codeup/hooks";
import { FaEnvelope, FaPen, FaSave } from "react-icons/fa";
import PopupManager from "../../global/PopupManager";
import { defaultMdOpts } from "../../global/md/defaultProps";
import Markdown from "markdown-to-jsx";
import { useRouter } from "next/router";

export default function UserPage() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });
  const router = useRouter();

  const { t } = useTranslation("user-page");

  const { username } = router.query;

  const { userInfo } = useLoggedIn();

  const [page, setPage] = React.useState<{
    username: string;
    displayName: string;
    links: string[];
    readme: string;
  } | null>(null);

  useEffect(() => {
    if (!username) return;

    reload();
  }, [username]);

  const reload = async () => {
    const res = await REST.UserPages.getUserPage(
      username as string,
      localStorage.getItem("token") as string
    );

    if (res.status !== 200) {
      return;
    } else {
      setPage(res.payload.data);
    }
  };

  return (
    <>
      <Head>
        <title>
          @{username} - {t("page.title")}
        </title>
      </Head>
      <Box w={"100%"} minH={"100vh"} h={"fit-content"} bg={"gray.900"}>
        <Flex
          justifyContent={"center"}
          pt={4}
          minW={"100%"}
          minH={"100vh"}
          pb={4}
        >
          <Box
            bg={"black"}
            rounded={"lg"}
            p={2}
            minW={"400px"}
            w={{
              base: "100%",
              md: "80%",
              lg: "70%",
              xl: "60%",
            }}
          >
            {page ? (
              <>
                <Flex
                  justifyContent={"center"}
                  mb={4}
                  mt={4}
                  direction={{
                    base: "column",
                    md: "row",
                  }}
                  gap={8}
                  alignItems={"center"}
                >
                  <Avatar
                    size={"xl"}
                    name={page.displayName}
                    src={"/api/account/" + page.username + "/picture"}
                  />
                  <Flex direction={"column"} h={"100%"}>
                    <Heading size={"lg"}>{page.displayName}</Heading>
                    <p>@{page.username}</p>
                  </Flex>
                  <Box></Box>
                  <IconButton
                    aria-label={"Message"}
                    display={
                      userInfo && userInfo.username !== page.username
                        ? "flex"
                        : "none"
                    }
                    icon={<FaEnvelope />}
                    onClick={async () => {
                      const r = await REST.Forum.createChatV2({
                        user: page.username,
                        token: localStorage.getItem("token") as string,
                      });

                      if (r.status === 200) {
                        window.open(
                          "/forum/messages/" +
                            r.payload.chat._id +
                            "?noLayout=true",
                          "_blank"
                        );
                      } else {
                        await PopupManager.alertAsync({
                          title: t("base:control.error"),
                          description:
                            t("base:control.error.request") + r.payload.error,
                        });
                      }
                    }}
                    variant={"brand"}
                  />
                  <IconButton
                    aria-label={"Edit"}
                    variant={"brand"}
                    display={
                      userInfo && userInfo.username === page.username
                        ? "flex"
                        : "none"
                    }
                    icon={<FaPen />}
                    onClick={async () => {
                      await PopupManager.alertAsync({
                        title: t("edit.profile"),
                        description: (
                          <>
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const fd = new FormData(e.target as any);

                                const res = await REST.UserPages.updateUserPage(
                                  username as string,
                                  localStorage.getItem("token") as string,
                                  {
                                    displayName: fd.get(
                                      "displayName"
                                    ) as string,
                                    links: (fd.get("links") as string).split(
                                      "\n"
                                    ),
                                    readme: fd.get("readme") as string,
                                  }
                                );

                                PopupManager.removeCurrentPopup();

                                if (res.status !== 200) {
                                  await PopupManager.alertAsync({
                                    title: t("base:control.error"),
                                    description:
                                      t("base:control.error.request") +
                                      res.payload.error,
                                  });
                                  return;
                                }

                                await reload();
                              }}
                            >
                              <Stack gap={4}>
                                <FormControl isRequired>
                                  <FormLabel>
                                    {t("profile.display.name")}
                                  </FormLabel>
                                  <Input
                                    type={"text"}
                                    defaultValue={page.displayName}
                                    placeholder={t("profile.display.name")}
                                    name={"displayName"}
                                  />
                                  <FormHelperText>
                                    {t("profile.display.name.help")}
                                  </FormHelperText>
                                </FormControl>
                                <FormControl isRequired>
                                  <FormLabel>{t("links")}</FormLabel>
                                  <Textarea
                                    defaultValue={page.links.join("\n")}
                                    placeholder={t("links")}
                                    name={"links"}
                                  />
                                  <FormHelperText>
                                    {t("profile.links.help")}
                                  </FormHelperText>
                                </FormControl>
                                <FormControl isRequired>
                                  <FormLabel>{t("readme")}</FormLabel>
                                  <Textarea
                                    defaultValue={page.readme}
                                    placeholder={t("readme")}
                                    name={"readme"}
                                  />
                                  <FormHelperText>
                                    {t("profile.readme.help")}
                                  </FormHelperText>
                                </FormControl>
                                <Button
                                  type={"submit"}
                                  variant={"brand"}
                                  leftIcon={<FaSave />}
                                >
                                  {t("save")}
                                </Button>
                              </Stack>
                            </form>
                          </>
                        ),
                      });
                    }}
                  />
                </Flex>
                <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
                  {page.links.map((link, i) => (
                    <a key={i} href={link} target={"_blank"}>
                      <Image
                        src={`https://www.google.com/s2/favicons?domain=${link}&size=128`}
                        width={9}
                        rounded={"xl"}
                      />
                    </a>
                  ))}
                </Flex>
                <Tabs
                  isFitted
                  colorScheme={"brand"}
                  variant={"enclosed-colored"}
                  mt={8}
                >
                  <TabList>
                    <Tab>{t("readme")}</Tab>
                    <Tab>{t("posts")}</Tab>
                    <Tab>{t("repositories")}</Tab>
                    <Tab>{t("certificates")}</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Markdown options={defaultMdOpts}>{page.readme}</Markdown>
                    </TabPanel>
                    <TabPanel>
                      <UserPostList
                        username={page.username}
                        loggedInUser={userInfo}
                        displayName={page.displayName}
                      />
                    </TabPanel>
                    <TabPanel>
                      <UserPageRepositoryList
                        username={page.username}
                        user={userInfo}
                      />
                    </TabPanel>
                    <TabPanel>
                      <UserPageCertificates username={page.username} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </>
            ) : (
              <>
                <AuthenticateLoadingIndicator text={t("page.loading")} />
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["user-page", "forum"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
