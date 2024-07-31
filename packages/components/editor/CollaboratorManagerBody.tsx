/**
 * packages/components/editor/CollaboratorManagerBody.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.01.2023
 *
 */

import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { FaCogs, FaPlus, FaTrash } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { Socket } from "socket.io-client";
import { useLoggedIn } from "@codeup/hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

export default function CollaboratorManagerBody(props: {
  projectId: string | undefined;
  socket: Socket;
}) {
  const { t } = useTranslation("editor");
  const toast = useToast();

  const { userInfo } = useLoggedIn();

  const [contributors, setContributors] = useState<{
    owner: {
      email: string;
      id: string;
      permissions: string[];
      username: string;
      firstName: string;
      lastName: string;
    };
    contributors: {
      email: string;
      id: string;
      permissions: string[];
      username: string;
      firstName: string;
      lastName: string;
    }[];
  } | null>(null);

  useEffect(() => {
    if (props.projectId && props.projectId !== "0") {
      props.socket.on("editor:projects:contributors", (data: any) => {
        console.log(data);
        if (data.success) {
          setContributors({
            owner: data.owner,
            contributors: data.contributors,
          });
        } else {
          toast({
            title: t("base:control.error"),
            description: data.error,
            status: "error",
            duration: 1500,
            isClosable: true,
            position: "bottom-right",
          });
        }
      });

      props.socket.emit("editor:projects:contributors", {
        id: props.projectId,
      });
    }
  }, [props.projectId]);

  return (
    <>
      {props.projectId &&
      props.projectId !== "0" &&
      contributors &&
      contributors.owner &&
      contributors.contributors ? (
        <>
          <Flex justifyContent={"right"} mr={[0, "2rem"]}>
            <Popover>
              <PopoverTrigger>
                <Button variant={"brand"} leftIcon={<FaPlus />}>
                  {t("add")}
                </Button>
              </PopoverTrigger>
              <PopoverContent bgColor={"black"}>
                <PopoverArrow bgColor={"black"} />
                <PopoverCloseButton />
                <PopoverHeader fontSize={["xl", "2xl"]}>
                  {t("contributors.add")}
                </PopoverHeader>
                <PopoverBody fontSize={["lg", "xl"]}>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      // @ts-ignore
                      const email = e.target.elements.email_i.value;

                      props.socket.emit("editor:projects:contributors:add", {
                        id: props.projectId,
                        email: email,
                      });

                      props.socket.on(
                        "editor:projects:contributors:add",
                        (data: any) => {
                          console.log(data);
                          if (data.success) {
                            let c0n: any = contributors;

                            c0n.contributors.push(data.contributor);

                            setContributors({
                              owner: contributors.owner,
                              contributors: [...c0n.contributors],
                            });
                          } else {
                            toast({
                              title: t("base:control.error"),
                              description: data.error,
                              status: "error",
                              duration: 1500,
                              isClosable: true,
                              position: "bottom-right",
                            });
                          }
                        }
                      );
                    }}
                  >
                    <Stack>
                      <FormControl>
                        <FormLabel>{t("email")}</FormLabel>
                        <InputGroup>
                          <InputLeftAddon>
                            <HiMail />
                          </InputLeftAddon>
                          <Input
                            id={"email_i"}
                            name="email_i"
                            placeholder={"E-Mail"}
                          />
                        </InputGroup>
                      </FormControl>
                      <Button type="submit" colorScheme={"whatsapp"}>
                        {t("add")}
                      </Button>
                    </Stack>
                  </form>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
          <Flex m={[0, "2rem"]} direction={"column"} fontSize={["xl", "2xl"]}>
            <Flex direction={"row"} mb={"1.2rem"}>
              <Box flex={"10%"}></Box>
              <Box flex={"20%"} fontWeight={"bold"}>
                {t("name")}
              </Box>
              <Box flex={"50%"}></Box>
              <Flex
                flex={"20%"}
                alignItems={"center"}
                justifyContent={"center"}
                fontWeight={"bold"}
              >
                {t("permissions")}
              </Flex>
            </Flex>
            <Divider />
            <Flex direction={"row"} mt={"1.2rem"} mb={"1.2rem"}>
              <Box flex={"10%"}>
                <Avatar
                  src={
                    "/api/account/" + contributors.owner.username + "/picture"
                  }
                  size={"md"}
                />
              </Box>
              <Box flex={"20%"}>
                {contributors.owner.firstName}&nbsp;
                {contributors.owner.lastName}
                <br />
                <Text color={"gray.400"} fontSize={["lg", "xl"]}>
                  @{contributors.owner.username}
                </Text>
              </Box>
              <Box flex={"50%"}></Box>
              <Flex flex={"20%"} alignItems={"center"} justifyContent={"right"}>
                <Tooltip label={t("permissions.owner")} hasArrow={true}>
                  <Tag size={"lg"} variant={"solid"} colorScheme={"red"}>
                    {t("owner")}
                  </Tag>
                </Tooltip>
              </Flex>
            </Flex>
            <Divider />
            {contributors.contributors.map((contributor) => {
              return (
                <>
                  <Flex direction={"row"} mt={"1.2rem"} mb={"1.2rem"}>
                    <Box flex={"10%"}>
                      <Avatar
                        src={
                          "/api/account/" + contributor.username + "/picture"
                        }
                        size={"md"}
                      />
                    </Box>
                    <Box flex={"20%"}>
                      {contributor.firstName}&nbsp;
                      {contributor.lastName}
                      <br />
                      <Text color={"gray.400"} fontSize={["lg", "xl"]}>
                        @{contributor.username}
                      </Text>
                    </Box>
                    <Box flex={"10%"}></Box>
                    <Flex
                      flex={"60%"}
                      justifyContent={"right"}
                      direction={["column", "row"]}
                      gap={["2rem", 0]}
                    >
                      <Box flex={"80%"}>
                        <SimpleGrid minChildWidth={130} w={"100%"} spacing={3}>
                          {contributor.permissions.includes("READ") ? (
                            <Tag
                              size={"lg"}
                              variant={"solid"}
                              colorScheme={"teal"}
                            >
                              {t("permissions.read")}
                            </Tag>
                          ) : null}
                          {contributor.permissions.includes("WRITE") ? (
                            <Tag
                              size={"lg"}
                              variant={"solid"}
                              colorScheme={"teal"}
                            >
                              {t("permissions.write")}
                            </Tag>
                          ) : null}
                          {contributor.permissions.includes("DELETE") ? (
                            <Tag
                              size={"lg"}
                              variant={"solid"}
                              colorScheme={"teal"}
                            >
                              {t("permissions.delete")}
                            </Tag>
                          ) : null}
                          {contributor.permissions.includes("RENAME") ? (
                            <Tag
                              size={"lg"}
                              variant={"solid"}
                              colorScheme={"teal"}
                            >
                              {t("permissions.rename")}
                            </Tag>
                          ) : null}
                          {contributor.permissions.includes(
                            "MANAGE-CONTRIBUTORS"
                          ) ? (
                            <Tag
                              size={"lg"}
                              variant={"solid"}
                              colorScheme={"teal"}
                            >
                              {t("permissions.manage.contributors")}
                            </Tag>
                          ) : null}
                        </SimpleGrid>
                      </Box>
                      <Flex
                        flex={"20%"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <ButtonGroup>
                          <Popover>
                            <PopoverTrigger>
                              <IconButton aria-label={t("contributors.remove")}>
                                <FaTrash />
                              </IconButton>
                            </PopoverTrigger>
                            <PopoverContent bgColor={"gray.800"}>
                              <PopoverArrow bgColor={"gray.800"} />
                              <PopoverCloseButton />
                              <PopoverHeader>
                                {t("contributors.remove")}
                              </PopoverHeader>
                              <PopoverBody>
                                <Stack>
                                  <Text fontSize={"lg"}>
                                    {t("contributors.remove.confirm")}&nbsp;
                                    {contributor.firstName}&nbsp;
                                    {contributor.lastName}&nbsp;(
                                    {contributor.username})
                                  </Text>
                                  <Button
                                    variant={"solid"}
                                    colorScheme={"red"}
                                    onClick={async () => {
                                      props.socket.emit(
                                        "editor:projects:contributors:delete",
                                        {
                                          id: props.projectId,
                                          email: contributor.email,
                                        }
                                      );

                                      props.socket.on(
                                        "editor:projects:contributors:delete",
                                        (data: any) => {
                                          if (data.success) {
                                            let c0n: any = contributors;

                                            c0n = c0n.contributors.filter(
                                              (c: any) =>
                                                c.email !== contributor.email
                                            );

                                            setContributors({
                                              owner: contributors.owner,
                                              contributors: [...c0n],
                                            });
                                          } else {
                                            toast({
                                              title: t("base:control.error"),
                                              description: data.error,
                                              position: "top",
                                              status: "error",
                                              variant: "solid",
                                              isClosable: true,
                                            });
                                          }
                                        }
                                      );
                                    }}
                                  >
                                    {t("remove")}
                                  </Button>
                                </Stack>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>

                          {userInfo.id !== contributor.id ? (
                            <>
                              <Popover>
                                <PopoverTrigger>
                                  <IconButton
                                    aria-label={t("permissions.manage")}
                                  >
                                    <FaCogs />
                                  </IconButton>
                                </PopoverTrigger>
                                <PopoverContent bgColor={"gray.800"}>
                                  <PopoverArrow bgColor={"gray.800"} />
                                  <PopoverCloseButton />
                                  <PopoverHeader>
                                    {t("permissions.change")}
                                  </PopoverHeader>
                                  <PopoverBody>
                                    <Stack>
                                      <Checkbox
                                        defaultChecked={contributor.permissions.includes(
                                          "READ"
                                        )}
                                        disabled={true}
                                        colorScheme={"brand"}
                                      >
                                        {t("permissions.read")}
                                      </Checkbox>
                                      <Checkbox
                                        defaultChecked={contributor.permissions.includes(
                                          "WRITE"
                                        )}
                                        id={
                                          "cb-upd-perms-" +
                                          contributor.id +
                                          "-write"
                                        }
                                        colorScheme={"brand"}
                                      >
                                        {t("permissions.write")}
                                      </Checkbox>
                                      <Checkbox
                                        defaultChecked={contributor.permissions.includes(
                                          "DELETE"
                                        )}
                                        id={
                                          "cb-upd-perms-" +
                                          contributor.id +
                                          "-delete"
                                        }
                                        colorScheme={"brand"}
                                      >
                                        {t("permissions.delete")}
                                      </Checkbox>
                                      <Checkbox
                                        defaultChecked={contributor.permissions.includes(
                                          "RENAME"
                                        )}
                                        id={
                                          "cb-upd-perms-" +
                                          contributor.id +
                                          "-rename"
                                        }
                                        colorScheme={"brand"}
                                      >
                                        {t("permissions.rename")}
                                      </Checkbox>
                                      <Checkbox
                                        defaultChecked={contributor.permissions.includes(
                                          "MANAGE-CONTRIBUTORS"
                                        )}
                                        id={
                                          "cb-upd-perms-" +
                                          contributor.id +
                                          "-manage_contributors"
                                        }
                                        colorScheme={"brand"}
                                      >
                                        {t("permissions.manage.contributors")}
                                      </Checkbox>
                                      <Button
                                        variant={"brand"}
                                        onClick={async () => {
                                          let perms: string[] = [
                                            "READ",
                                            (
                                              document.getElementById(
                                                "cb-upd-perms-" +
                                                  contributor.id +
                                                  "-write"
                                              ) as HTMLInputElement
                                            ).checked
                                              ? "WRITE"
                                              : "null",
                                            (
                                              document.getElementById(
                                                "cb-upd-perms-" +
                                                  contributor.id +
                                                  "-delete"
                                              ) as HTMLInputElement
                                            ).checked
                                              ? "DELETE"
                                              : "null",
                                            (
                                              document.getElementById(
                                                "cb-upd-perms-" +
                                                  contributor.id +
                                                  "-rename"
                                              ) as HTMLInputElement
                                            ).checked
                                              ? "RENAME"
                                              : "null",
                                            (
                                              document.getElementById(
                                                "cb-upd-perms-" +
                                                  contributor.id +
                                                  "-manage_contributors"
                                              ) as HTMLInputElement
                                            ).checked
                                              ? "MANAGE-CONTRIBUTORS"
                                              : "null",
                                          ].filter((e) => e !== "null");

                                          props.socket.emit(
                                            "editor:projects:contributors:permission",
                                            {
                                              id: props.projectId,
                                              email: contributor.email,
                                              permissions: perms,
                                            }
                                          );

                                          props.socket.on(
                                            "editor:projects:contributors:permission",
                                            (data: any) => {
                                              if (data.success) {
                                                props.socket.emit(
                                                  "editor:projects:contributors",
                                                  {
                                                    id: props.projectId,
                                                  }
                                                );
                                              } else {
                                                toast({
                                                  title:
                                                    t("base:control.error"),
                                                  description: data.error,
                                                  position: "top",
                                                  status: "error",
                                                  variant: "solid",
                                                  isClosable: true,
                                                });
                                              }
                                            }
                                          );
                                        }}
                                      >
                                        {t("save")}
                                      </Button>
                                    </Stack>
                                  </PopoverBody>
                                </PopoverContent>
                              </Popover>
                            </>
                          ) : null}
                        </ButtonGroup>
                      </Flex>
                    </Flex>
                  </Flex>
                </>
              );
            })}
          </Flex>
        </>
      ) : null}
    </>
  );
}
