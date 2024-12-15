/**
 * apps/web/src/pages/u/[username]/[repo].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.11.2024
 *
 */

import * as React from "react";
import { useLoggedIn, useUserLoggedInRedirect } from "@codeup/hooks";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { sProp } from "../../../global/i18nstaticProps";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import IssueList from "@codeup/components/repos/IssueList";
import {
  Box,
  Button,
  Code,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  UnorderedList,
} from "@chakra-ui/react";
import {
  RiGitRepositoryFill,
  RiGitRepositoryPrivateFill,
} from "react-icons/ri";
import { BiDotsHorizontalRounded, BiDotsVerticalRounded } from "react-icons/bi";
import { FaPen, FaPlay, FaPlus, FaTrash } from "react-icons/fa";
import PopupManager from "../../../global/PopupManager";
import Highlight from "react-highlight";
import "highlight.js/styles/base16/3024.min.css";

export default function RepoViewer() {
  const { t } = useTranslation("user-page");

  const [repo, setRepo] = React.useState<{
    _id: string;
    createdAt: string;
    user: string;
    username: string;
    name: string;
    description: string;
    public: boolean;
    deploymentType: string;
    deploymentName: string;
    lastDeployment: string;
  } | null>(null);

  const { userInfo } = useLoggedIn();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const reload = async () => {
    const res = await REST.Repositories.getRepository(
      router.query.username as string,
      router.query.repo as string,
      AccountManager.getActiveToken()
    );

    if (res.status !== 200) {
      setError(res.payload.error);
      setLoading(false);
      return;
    }

    setRepo(res.payload.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!router.query.username || !router.query.repo) return;
    reload();
  }, [router.query.username, router.query.repo]);

  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  if (loading) {
    return <AuthenticateLoadingIndicator />;
  }

  if (error) {
    return <ErrorComponent description={error} />;
  }

  if (!repo) {
    return <AuthenticateLoadingIndicator />;
  }

  return (
    <>
      <Box w={"100%"} minH={"100vh"} h={"fit-content"} bg={"#000"}>
        <HStack
          bg={"gray.900"}
          rounded={"md"}
          p={4}
          alignItems={"center"}
          gap={4}
          justifyContent={"space-between"}
          direction={{
            base: "column",
            md: "row",
          }}
        >
          <HStack gap={4}>
            <Text fontSize={"4xl"}>
              {repo.public ? (
                <RiGitRepositoryFill />
              ) : (
                <RiGitRepositoryPrivateFill />
              )}
            </Text>
            <Heading size={"lg"}>
              @{router.query.username}/{repo.name}
            </Heading>
          </HStack>
          <Menu>
            <MenuButton
              as={IconButton}
              variant={"brand"}
              aria-label={"actions"}
              icon={<BiDotsHorizontalRounded />}
              display={repo.username === userInfo.username ? "flex" : "none"}
            />
            <MenuList>
              <MenuItem
                icon={<FaPen />}
                onClick={async () => {
                  await PopupManager.alertAsync({
                    title: t("repos.create"),
                    description: (
                      <>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();

                            const fd = new FormData(
                              e.target as HTMLFormElement
                            );

                            const ip = (
                              document.querySelector(
                                "#repo-is-public"
                              ) as HTMLInputElement
                            ).checked;

                            const res =
                              await REST.Repositories.updateRepository(
                                AccountManager.getActiveToken(),
                                repo.username,
                                repo.name,
                                {
                                  description: fd.get("description") as string,
                                  isPublic: ip,
                                  deploymentType: fd.get(
                                    "deploymentType"
                                  ) as string,
                                  deploymentName: fd.get(
                                    "deploymentName"
                                  ) as string,
                                }
                              );

                            if (res.status !== 200) {
                              await PopupManager.alertAsync({
                                title: t("base:control.error"),
                                description:
                                  t("base:control.error.request") +
                                  res.payload.error,
                              });
                              return;
                            }

                            PopupManager.removeCurrentPopup();

                            await reload();
                          }}
                        >
                          <Stack gap={4}>
                            <FormControl isRequired>
                              <FormLabel>
                                {t("repos.create.description")}
                              </FormLabel>
                              <Textarea
                                name={"description"}
                                placeholder={t("repos.create.description")}
                                defaultValue={repo.description}
                              />
                              <FormHelperText>
                                {t("repos.create.description.helper")}
                              </FormHelperText>
                            </FormControl>
                            <FormControl>
                              <FormLabel>{t("repos.create.public")}</FormLabel>
                              <Switch
                                id={"repo-is-public"}
                                colorScheme={"brand"}
                                defaultChecked={repo.public}
                              />
                              <FormHelperText>
                                {t("repos.create.public.helper")}
                              </FormHelperText>
                            </FormControl>
                            <FormControl isRequired>
                              <FormLabel>
                                {t("repos.create.deploy.type")}
                              </FormLabel>
                              <Select
                                name={"deploymentType"}
                                defaultValue={repo.deploymentType}
                              >
                                <option value={"static"}>Static (HTML)</option>
                                <option value={"dynamic"}>
                                  Dynamic (Next.JS/Server/...)
                                </option>
                              </Select>
                              <FormHelperText>
                                {t("repos.create.deploy.type.helper")}
                              </FormHelperText>
                            </FormControl>
                            <FormControl isRequired>
                              <FormLabel>
                                {t("repos.create.deploy.name")}
                              </FormLabel>
                              <InputGroup>
                                <Input
                                  name={"deploymentName"}
                                  placeholder={t("repos.create.deploy.name")}
                                  defaultValue={repo.deploymentName}
                                />
                                <InputRightAddon>.codexp.dev</InputRightAddon>
                              </InputGroup>
                              <FormHelperText>
                                {t("repos.create.deploy.name.helper")}
                              </FormHelperText>
                            </FormControl>
                            <Button
                              type={"submit"}
                              variant={"brand"}
                              leftIcon={<FaPlus />}
                            >
                              {t("repos.update.submit")}
                            </Button>
                          </Stack>
                        </form>
                      </>
                    ),
                  });
                }}
              >
                {t("repo.actions.edit")}
              </MenuItem>
              <MenuItem
                icon={<FaTrash />}
                color={"red.500"}
                onClick={async () => {
                  if (
                    !(await PopupManager.confirmAsync({
                      title: t("repos.delete"),
                      question: t("repos.delete.confirm"),
                    }))
                  )
                    return;

                  const res = await REST.Repositories.deleteRepository(
                    AccountManager.getActiveToken(),
                    repo.username,
                    repo.name
                  );

                  if (res.status === 200) {
                    router.push("/u/" + repo.username);
                  } else {
                    await PopupManager.alertAsync({
                      title: t("base:control.error"),
                      description:
                        t("base:control.error.request") + res.payload.error,
                    });
                  }
                }}
              >
                {t("repo.actions.delete")}
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
        <Tabs variant={"brand"} isLazy>
          <TabList p={4} gap={2}>
            <Tab>{t("repos.tab.overview")}</Tab>
            <Tab>{t("repos.tab.issues")}</Tab>
          </TabList>
          <TabPanels p={0}>
            <TabPanel p={0}>
              <Box
                p={4}
                w={"100%"}
                minH={"80vh"}
                display={"flex"}
                justifyContent={"center"}
              >
                <Box
                  rounded={"md"}
                  p={4}
                  bg={"gray.900"}
                  w={"100%"}
                  maxWidth={"1600px"}
                >
                  <Heading size={"md"}>{t("repo.description")}</Heading>
                  <Text>{repo.description}</Text>
                  <br />
                  {t("repos.clone.one")}
                  <UnorderedList>
                    <ListItem>{t("repos.clone.local")}</ListItem>
                    <ListItem>{t("repos.clone.cloud")}</ListItem>
                  </UnorderedList>
                  <br />
                  <b>{t("repos.clone.a.local")}</b>
                  <Highlight className={"language-shell code-block-cup"}>
                    git clone https://git.codeup.space/@{repo.username}/
                    {repo.name}
                  </Highlight>
                  <br />
                  <b>{t("repos.clone.a.cloud")}</b>
                  <br />
                  <Button
                    mt={4}
                    variant={"brand"}
                    onClick={() => {
                      router.push("/cloud-pc/attach");
                    }}
                    leftIcon={<FaPlay />}
                  >
                    {t("repos.clone.cloud.attach")}
                  </Button>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel p={0}>
              <IssueList
                repoId={repo._id}
                isOwner={repo.username === userInfo.username}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["user-page"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
