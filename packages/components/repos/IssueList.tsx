/**
 * packages/components/repos/IssueList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.12.2024
 *
 */

import * as React from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { FaEye, FaPen, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { useTranslation } from "next-i18next";
import PopupManager from "@codeup/web/src/global/PopupManager";
import { GoIssueClosed, GoIssueOpened } from "react-icons/go";
import StackedMenu from "../menu/StackedMenu";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import StackedMenuItem from "../menu/StackedMenuItem";

export default function IssueList(props: { repoId: string; isOwner: boolean }) {
  const [issues, setIssues] = React.useState<any[]>([]);
  const { t } = useTranslation("user-page");
  const [query, setQuery] = React.useState<string>("");

  useEffect(() => {
    if (!props.repoId || props.repoId.trim() === "") return;

    reload();
  }, [props.repoId]);

  const reload = async () => {
    const res = await REST.Repositories.getIssues(
      AccountManager.getActiveToken(),
      props.repoId
    );

    if (res.status === 200) {
      setIssues(res.payload.issues);
    }
  };

  return (
    <>
      <Box w={"100%"} minH={"80vh"} display={"flex"} justifyContent={"center"}>
        <Box w={"100%"} maxW={"1600px"} rounded={"lg"} bg={"gray.900"} p={4}>
          <HStack justifyContent={"space-between"} gap={4}>
            <InputGroup>
              <InputLeftElement>
                <FaSearch />
              </InputLeftElement>
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                placeholder={t("base:control.search")}
              />
            </InputGroup>
            <Button
              variant={"brand"}
              leftIcon={<FaPlus />}
              onClick={async () => {
                await PopupManager.alertAsync({
                  title: t("repos.issues.create"),
                  description: (
                    <>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const fd = new FormData(e.target as any);

                          const res = await REST.Repositories.createIssue(
                            AccountManager.getActiveToken(),
                            props.repoId,
                            fd.get("title") as string,
                            fd.get("body") as string
                          );

                          if (res.status === 200) {
                            await reload();
                            PopupManager.removeCurrentPopup();
                          }
                        }}
                      >
                        <Stack spacing={4}>
                          <FormControl isRequired>
                            <FormLabel>{t("repos.issues.title")}</FormLabel>
                            <Input
                              name={"title"}
                              placeholder={t("repos.issues.title")}
                            />
                            <FormHelperText>
                              {t("repos.issues.title.helper")}
                            </FormHelperText>
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel>{t("repos.issues.body")}</FormLabel>
                            <Textarea
                              name={"body"}
                              placeholder={t("repos.issues.body")}
                            />
                            <FormHelperText>
                              {t("repos.issues.body.helper")}
                            </FormHelperText>
                          </FormControl>
                          <Button variant={"brand"} type={"submit"}>
                            {t("repos.issues.create")}
                          </Button>
                        </Stack>
                      </form>
                    </>
                  ),
                });
              }}
            >
              {t("repos.issues.create")}
            </Button>
          </HStack>
          <Stack spacing={4} mt={4}>
            {issues
              .filter((i) => {
                if (query.trim() === "") return true;
                return (
                  i.title.toLowerCase().includes(query.toLowerCase()) ||
                  i.body.toLowerCase().includes(query.toLowerCase()) ||
                  i.status.toLowerCase().includes(query.toLowerCase())
                );
              })
              .map((i) => {
                return (
                  <>
                    <HStack
                      bg={"gray.800"}
                      p={3}
                      justifyContent={"space-between"}
                    >
                      <HStack>
                        {i.status === "open" ? (
                          <GoIssueOpened color={"#ff0000"} />
                        ) : (
                          <GoIssueClosed color={"#00ff00"} />
                        )}
                        <Heading size={"md"}>{i.title}</Heading>
                      </HStack>
                      <HStack>
                        <IconButton
                          aria-label={"show"}
                          icon={<FaEye />}
                          variant={"brand"}
                          onClick={async () => {
                            await PopupManager.alertAsync({
                              title: i.title,
                              description: (
                                <>
                                  <Heading size={"md"}>{i.title}</Heading>
                                  <p>{i.body}</p>
                                </>
                              ),
                            });
                          }}
                        />
                        <StackedMenu
                          trigger={
                            <IconButton
                              aria-label={"more"}
                              icon={<BiDotsHorizontalRounded />}
                              variant={"brand"}
                              display={props.isOwner ? "flex" : "none"}
                            />
                          }
                        >
                          <StackedMenuItem
                            title={t("repos.issues.delete")}
                            description={"repos.issues.delete.text"}
                            icon={<FaTrash />}
                            onClick={async () => {
                              const res = await REST.Repositories.deleteIssue(
                                AccountManager.getActiveToken(),
                                props.repoId,
                                i._id
                              );

                              if (res.status === 200) {
                                await reload();
                              }
                            }}
                          />

                          <StackedMenuItem
                            title={
                              i.status === "open"
                                ? t("repos.issues.close")
                                : t("repos.issues.reopen")
                            }
                            description={
                              i.status === "open"
                                ? "repos.issues.close.text"
                                : "repos.issues.reopen.text"
                            }
                            icon={
                              i.status === "open" ? (
                                <GoIssueClosed />
                              ) : (
                                <GoIssueOpened />
                              )
                            }
                            onClick={async () => {
                              const res = await REST.Repositories.updateIssue(
                                AccountManager.getActiveToken(),
                                props.repoId,
                                i._id,
                                i.body,
                                i.title,
                                i.status === "open" ? "closed" : "open"
                              );

                              if (res.status === 200) {
                                await reload();
                              }
                            }}
                          />
                          <StackedMenuItem
                            title={t("repos.issues.edit")}
                            description={"repos.issues.edit.text"}
                            icon={<FaPen />}
                            onClick={async () => {
                              await PopupManager.alertAsync({
                                title: t("repos.issues.edit"),
                                description: (
                                  <>
                                    <form
                                      onSubmit={async (e) => {
                                        e.preventDefault();
                                        const fd = new FormData(
                                          e.target as any
                                        );

                                        const res =
                                          await REST.Repositories.updateIssue(
                                            AccountManager.getActiveToken(),
                                            props.repoId,
                                            i._id,
                                            fd.get("body") as string,
                                            fd.get("title") as string,
                                            i.status
                                          );

                                        if (res.status === 200) {
                                          await reload();
                                          PopupManager.removeCurrentPopup();
                                        }
                                      }}
                                    >
                                      <Stack spacing={4}>
                                        <FormControl isRequired>
                                          <FormLabel>
                                            {t("repos.issues.title")}
                                          </FormLabel>
                                          <Input
                                            name={"title"}
                                            placeholder={t(
                                              "repos.issues.title"
                                            )}
                                            defaultValue={i.title}
                                          />
                                          <FormHelperText>
                                            {t("repos.issues.title.helper")}
                                          </FormHelperText>
                                        </FormControl>
                                        <FormControl isRequired>
                                          <FormLabel>
                                            {t("repos.issues.body")}
                                          </FormLabel>
                                          <Textarea
                                            name={"body"}
                                            placeholder={t("repos.issues.body")}
                                            defaultValue={i.body}
                                          />
                                          <FormHelperText>
                                            {t("repos.issues.body.helper")}
                                          </FormHelperText>
                                        </FormControl>
                                        <Button
                                          variant={"brand"}
                                          type={"submit"}
                                        >
                                          {t("repos.issues.edit")}
                                        </Button>
                                      </Stack>
                                    </form>
                                  </>
                                ),
                              });
                            }}
                          />
                        </StackedMenu>
                      </HStack>
                    </HStack>
                  </>
                );
              })}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
