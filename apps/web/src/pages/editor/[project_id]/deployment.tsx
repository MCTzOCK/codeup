/**
 * apps/web/src/pages/editor/[project_id]/deployment.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.01.23
 *
 */
import * as React from "react";
import EditorProjectLayout from "@codeup/components/editor/EditorProjectLayout";
import CollaboratorManagerBody from "@codeup/components/editor/CollaboratorManagerBody";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
import PopupManager from "../../../global/PopupManager";
import { useLoggedIn } from "@codeup/hooks";
import { useId } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { v4 } from "uuid";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function Contributors() {
  const router = useRouter();
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const [reactSocket, setReactSocket] = React.useState<Socket | null>(null);
  let socket: Socket | null = null;
  const [project, setProject] = React.useState<any>({});
  const [customDomain, setCustomDomain] = React.useState<string>("");
  const { t } = useTranslation("editor");

  React.useEffect(() => {
    if (loaded) {
      if (!loggedIn) {
        router.push("/#login");
        window.dispatchEvent(new CustomEvent("codeup::open_login"));
      } else {
        if (router.query.project_id) {
          socket = io();
          setReactSocket(socket);
          registerSocket();
        }
      }
    }
  }, [loggedIn, userInfo, loaded, router]);

  const registerSocket = () => {
    if (socket) {
      socket.on("authenticate", (data: any) => {
        if (!data.authenticated) {
          router.push("/#login");
          window.dispatchEvent(new CustomEvent("codeup::open_login"));
        } else {
          socket?.emit("editor:projects:info", { id: router.query.project_id });
        }
      });
      socket.on("editor:projects:info", (data: any) => {
        if (data.success) {
          setProject(data.project);
          if (!data.project.customDomain.startsWith("disabled:")) {
            setCustomDomain(data.project.customDomain.split(".")[0]);
          }
        } else {
          PopupManager.alert({
            title: t("base:control.error"),
            description: data.error,
          });
        }
      });

      socket.emit("authenticate", localStorage.getItem("token") as string);

      // @ts-ignore
      window.__backup_socket = socket;
    }
  };

  const inputId = useId();

  return (
    <>
      <Head>
        <title>{t("deployment.doc.title")}</title>
      </Head>
      <EditorProjectLayout>
        <Box textAlign={"center"} pt={6}>
          <CHeading>{t("deployment")}</CHeading>
        </Box>
        {reactSocket ? (
          <>
            <Flex w={"100%"} alignItems={"center"} justifyContent={"center"}>
              <Box w={"50%"} mt={4}>
                <Stack>
                  <Text>{t("deployment.text")}</Text>
                  <StackDivider />
                  <FormControl>
                    <InputGroup>
                      <Input
                        id={inputId}
                        placeholder={t("deployment.subdomain")}
                        defaultValue={customDomain}
                      />
                      <InputRightAddon>.codeup.space</InputRightAddon>
                    </InputGroup>
                  </FormControl>
                  <Button
                    onClick={() => {
                      const newDomain = (
                        document.getElementById(inputId) as HTMLInputElement
                      ).value;

                      let d =
                        newDomain +
                        "." +
                        (window.location.hostname.includes(":")
                          ? window.location.hostname.split(":")[0]
                          : window.location.hostname);

                      if (newDomain === "") d = "disabled:" + v4();

                      if (reactSocket) {
                        reactSocket.on(
                          "editor:projects:settings",
                          (data: any) => {
                            if (data.success) {
                              if (newDomain === "") {
                                PopupManager.alert({
                                  title: t("success"),
                                  description: t("deployment.unpublished"),
                                });
                                return;
                              }

                              PopupManager.alert({
                                title: t("success"),
                                description:
                                  t("deployment.available") + " https://" + d,
                              });
                            } else {
                              PopupManager.alert({
                                title: t("base:control.error"),
                                description: data.error,
                              });
                            }
                          }
                        );

                        reactSocket.emit("editor:projects:settings", {
                          id: router.query.project_id,
                          update: {
                            customDomain: d,
                          },
                        });
                      }
                    }}
                  >
                    {t("save")}
                  </Button>
                  {customDomain !== "" ? (
                    <Button
                      leftIcon={<FaExternalLinkAlt />}
                      variant={"brand"}
                      onClick={() => {
                        window.open(
                          `http://${customDomain}.codeup.space`,
                          "_blank"
                        );
                      }}
                    >
                      {t("deployment.open")}
                    </Button>
                  ) : null}
                </Stack>
              </Box>
            </Flex>
          </>
        ) : (
          <></>
        )}
      </EditorProjectLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["editor"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
