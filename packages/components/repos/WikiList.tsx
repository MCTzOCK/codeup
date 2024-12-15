/**
 * packages/components/repos/WikiList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.12.2024
 *
 */

import * as React from "react";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import { useEffect } from "react";
import Markdown from "markdown-to-jsx";
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
  InputLeftElement,
  Link,
  ListItem,
  OrderedList,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";
import { FaEye, FaPen, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import PopupManager from "@codeup/web/src/global/PopupManager";
import { useTranslation } from "next-i18next";
import { FaFileLines } from "react-icons/fa6";
import StackedMenu from "../menu/StackedMenu";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import StackedMenuItem from "../menu/StackedMenuItem";

export default function WikiList(props: { repoId: string; isOwner: boolean }) {
  const [pages, setPages] = React.useState<
    {
      _id: string;
      createdAt: string;
      title: string;
      content: string;
    }[]
  >([]);

  const { t } = useTranslation("user-page");

  const [query, setQuery] = React.useState<string>("");

  useEffect(() => {
    if (!props.repoId) return;

    reload();
  }, [props.repoId]);

  const reload = async () => {
    const res = await REST.Repositories.getWikiPages(
      AccountManager.getActiveToken(),
      props.repoId
    );

    if (res.status === 200) {
      setPages(res.payload.pages);
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
                  title: t("repos.wiki.create"),
                  description: (
                    <>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const fd = new FormData(e.target as any);

                          const res = await REST.Repositories.createWikiPage(
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
                            <FormLabel>{t("repos.wiki.title")}</FormLabel>
                            <Input
                              name={"title"}
                              placeholder={t("repos.wiki.title")}
                            />
                            <FormHelperText>
                              {t("repos.wiki.title.helper")}
                            </FormHelperText>
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel>{t("repos.wiki.body")}</FormLabel>
                            <Textarea
                              name={"body"}
                              placeholder={t("repos.wiki.body")}
                            />
                            <FormHelperText>
                              {t("repos.wiki.body.helper")}
                            </FormHelperText>
                          </FormControl>
                          <Button variant={"brand"} type={"submit"}>
                            {t("repos.wiki.create")}
                          </Button>
                        </Stack>
                      </form>
                    </>
                  ),
                });
              }}
            >
              {t("repos.wiki.create")}
            </Button>
          </HStack>
          <Stack spacing={4} mt={4}>
            {pages
              .filter((p) => {
                if (query.trim() === "") return true;
                return (
                  p.title.toLowerCase().includes(query.toLowerCase()) ||
                  p.content.toLowerCase().includes(query.toLowerCase())
                );
              })
              .map((p) => (
                <>
                  <HStack
                    justifyContent={"space-between"}
                    p={3}
                    bg={"gray.800"}
                    rounded={"lg"}
                  >
                    <HStack gap={2}>
                      <FaFileLines />
                      <Heading size={"md"}>{p.title}</Heading>
                    </HStack>
                    <HStack gap={2}>
                      <IconButton
                        aria-label={"view"}
                        icon={<FaEye />}
                        variant={"brand"}
                        onClick={async () => {
                          await PopupManager.alertAsync({
                            title: p.title,
                            customSize: "2xl",
                            description: (
                              <>
                                <Markdown
                                  options={{
                                    overrides: {
                                      h1: {
                                        component: Heading,
                                        props: {
                                          fontSize: "2xl",
                                          mb: 4,
                                          mt: 4,
                                          color: "brand.500",
                                          fontFamily:
                                            "Jetbrains Mono ExtraBold",
                                          letterSpacing: -2,
                                        },
                                      },
                                      h2: {
                                        component: Heading,
                                        props: {
                                          fontSize: "xl",
                                          mb: 4,
                                          mt: 4,
                                          color: "brand.500",
                                          fontFamily:
                                            "Jetbrains Mono ExtraBold",
                                        },
                                      },
                                      h3: {
                                        component: Heading,
                                        props: {
                                          fontSize: "lg",
                                          mb: 4,
                                          mt: 4,
                                        },
                                      },
                                      h4: {
                                        component: Heading,
                                        props: {
                                          fontSize: "md",
                                          mb: 4,
                                          mt: 4,
                                        },
                                      },
                                      h5: {
                                        component: Heading,
                                        props: {
                                          fontSize: "sm",
                                          mb: 4,
                                          mt: 4,
                                        },
                                      },
                                      h6: {
                                        component: Heading,
                                        props: {
                                          fontSize: "xs",
                                          mb: 4,
                                          mt: 4,
                                        },
                                      },
                                      a: {
                                        component: Link,
                                        props: {
                                          fontSize: "xl",
                                          color: "brand.500",
                                        },
                                      },
                                      ul: {
                                        component: UnorderedList,
                                        props: {
                                          fontSize: "xl",
                                        },
                                      },
                                      ol: {
                                        component: OrderedList,
                                        props: {
                                          fontSize: "xl",
                                        },
                                      },
                                      li: {
                                        component: ListItem,
                                        props: {
                                          fontSize: "xl",
                                        },
                                      },
                                      table: {
                                        component: Table,
                                        props: {
                                          fontSize: "xl",
                                        },
                                      },
                                      thead: {
                                        component: Thead,
                                        props: {
                                          fontSize: "xl",
                                        },
                                      },
                                      tbody: {
                                        component: Tbody,
                                        props: {
                                          fontSize: "xl",
                                        },
                                      },
                                      tr: {
                                        component: Tr,
                                        props: {
                                          fontSize: "xl",
                                        },
                                      },
                                      th: {
                                        component: Th,
                                        props: {
                                          fontSize: "xl",
                                        },
                                      },
                                      td: {
                                        component: Td,
                                        props: {
                                          fontSize: "xl",
                                        },
                                      },
                                      p: {
                                        component: Text,
                                        props: {
                                          fontSize: "xl",
                                        },
                                      },
                                      code: {
                                        component: Code,
                                        props: {
                                          fontSize: "xl",
                                        },
                                      },
                                    },
                                  }}
                                >
                                  {p.content}
                                </Markdown>
                              </>
                            ),
                          });
                        }}
                      />
                      <StackedMenu
                        trigger={
                          <IconButton
                            aria-label={"actions"}
                            icon={<BiDotsHorizontalRounded />}
                            variant={"brand"}
                            display={props.isOwner ? "flex" : "none"}
                          />
                        }
                      >
                        <StackedMenuItem
                          title={t("repos.wiki.delete")}
                          description={t("repos.wiki.delete.text")}
                          icon={<FaTrash />}
                          onClick={async () => {
                            const res = await REST.Repositories.deleteWikiPage(
                              AccountManager.getActiveToken(),
                              props.repoId,
                              p._id
                            );

                            if (res.status === 200) {
                              await reload();
                            }
                          }}
                        />
                        <StackedMenuItem
                          title={t("repos.wiki.edit")}
                          description={t("repos.wiki.edit.text")}
                          icon={<FaPen />}
                          onClick={async () => {
                            await PopupManager.alertAsync({
                              title: t("repos.wiki.edit"),
                              description: (
                                <>
                                  <form
                                    onSubmit={async (e) => {
                                      e.preventDefault();
                                      const fd = new FormData(e.target as any);

                                      const res =
                                        await REST.Repositories.updateWikiPage(
                                          AccountManager.getActiveToken(),
                                          props.repoId,
                                          p._id,
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
                                        <FormLabel>
                                          {t("repos.wiki.title")}
                                        </FormLabel>
                                        <Input
                                          name={"title"}
                                          placeholder={t("repos.wiki.title")}
                                          defaultValue={p.title}
                                        />
                                        <FormHelperText>
                                          {t("repos.wiki.title.helper")}
                                        </FormHelperText>
                                      </FormControl>
                                      <FormControl isRequired>
                                        <FormLabel>
                                          {t("repos.wiki.body")}
                                        </FormLabel>
                                        <Textarea
                                          name={"body"}
                                          placeholder={t("repos.wiki.body")}
                                          defaultValue={p.content}
                                        />
                                        <FormHelperText>
                                          {t("repos.wiki.body.helper")}
                                        </FormHelperText>
                                      </FormControl>
                                      <Button variant={"brand"} type={"submit"}>
                                        {t("repos.wiki.edit")}
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
              ))}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
