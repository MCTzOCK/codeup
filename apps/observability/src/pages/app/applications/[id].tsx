/**
 * apps/observability/src/pages/app/applications/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.10.2024
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import RestClient from "@/rest/RestClient";
import {
  ActionIcon,
  ActionIconGroup,
  Button,
  Container,
  FileInput,
  Flex,
  Input,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { FaFileImage, FaPen, FaPlus, FaTrash } from "react-icons/fa6";
import { modals } from "@mantine/modals";
import { FaSave } from "react-icons/fa";

export default function Application() {
  const router = useRouter();
  const [error, setError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  const [app, setApp] = React.useState<{
    name: string;
    _id: string;
    username: string;
    logo?: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;
    if (!RestClient.hasToken()) return;
    reload();
  }, [router, router.query, router.query.id, RestClient.hasToken()]);

  const reload = async () => {
    const res = await RestClient.getApplication(router.query.id as string);

    if (res.status === 200) {
      setApp(res.payload.data);
    } else {
      console.error(res);
      setError(true);
    }
    setLoading(false);
  };

  if (loading || !app) {
    return (
      <Flex align={"center"} justify={"center"} h={"100vh"} w={"100%"}>
        <Loader size={"lg"} />
      </Flex>
    );
  }
  if (error) {
    return (
      <>
        <Flex align={"center"} justify={"center"} w={"100%"}>
          <Text c={"red"}>
            An error occurred while loading the applications. For details,
            please check the browser console.
          </Text>
        </Flex>
      </>
    );
  }

  return (
    <>
      <Flex align={"center"} justify={"center"} w={"100%"}>
        <Container
          style={{
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            width: "100%",
          }}
          bg={"gray.9"}
        >
          <Flex align={"center"} justify={"space-between"}>
            <Flex align={"center"} gap={"md"}>
              <img
                src={app.logo}
                alt={app.name}
                style={{
                  height: 64,
                  width: 64,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <Stack gap={0}>
                <Text
                  size={"xl"}
                  style={{
                    fontWeight: "600",
                  }}
                >
                  {app.name}
                </Text>
                <Text size={"sm"}>{app.url}</Text>
              </Stack>
            </Flex>
            <ActionIcon.Group>
              <ActionIcon
                variant={"default"}
                size={"lg"}
                aria-label={"edit"}
                onClick={() => {
                  modals.open({
                    title: "Update Application",
                    centered: true,
                    children: (
                      <>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const fd = new FormData(
                              e.target as HTMLFormElement
                            );

                            const { name, url, logo } = Object.fromEntries(fd);

                            const fr = new FileReader();

                            fr.onload = async () => {
                              const res = await RestClient.updateApplication(
                                app._id!,
                                {
                                  name: name as string,
                                  url: url as string,
                                  logo:
                                    // @ts-ignore
                                    logo.size === 0 && logo.name === ""
                                      ? undefined
                                      : (fr.result as string),
                                }
                              );
                              if (res.status === 200) {
                                reload();
                                modals.closeAll();
                              } else {
                                modals.open({
                                  title: "Error",
                                  centered: true,
                                  children: (
                                    <Text c={"red"}>
                                      An error occurred while updating the
                                      application: {res.payload.error}
                                    </Text>
                                  ),
                                  size: "md",
                                });
                              }
                            };

                            fr.readAsDataURL(logo as Blob);
                          }}
                        >
                          <Input.Wrapper
                            label={"Name"}
                            description={"The name of your application"}
                          >
                            <Input
                              placeholder={"Name"}
                              name={"name"}
                              required
                              defaultValue={app.name}
                            />
                          </Input.Wrapper>
                          <Input.Wrapper
                            label={"URL"}
                            description={"The URL of your web application"}
                          >
                            <Input
                              placeholder={"URL"}
                              name={"url"}
                              required
                              type={"url"}
                              defaultValue={app.url}
                            />
                          </Input.Wrapper>
                          <FileInput
                            placeholder={"Logo"}
                            label={"Attach your logo"}
                            leftSection={<FaFileImage />}
                            fileInputProps={{
                              accept: "image/*",
                            }}
                            name={"logo"}
                          />
                          <Button
                            type={"submit"}
                            color={"blue"}
                            variant={"light"}
                            mt={"md"}
                            w={"100%"}
                            leftSection={<FaSave />}
                          >
                            Update
                          </Button>
                        </form>
                      </>
                    ),
                    size: "md",
                  });
                }}
              >
                <FaPen />
              </ActionIcon>
              <ActionIcon
                variant={"default"}
                size={"lg"}
                aria-label={"delete"}
                color={"red"}
                onClick={() => {
                  modals.openConfirmModal({
                    title: "Delete Application",
                    children: (
                      <>
                        <Text size={"sm"}>
                          Are you sure you want to delete the application{" "}
                          {app.name}? This will delete all data associated with
                          this application and cannot be undone!
                        </Text>
                      </>
                    ),
                    labels: { confirm: "Delete", cancel: "Cancel" },
                    onConfirm: async () => {
                      const res = await RestClient.deleteApplication(app._id);
                      if (res.status === 200) {
                        window.location.assign("/app");
                      } else {
                        console.error(res);
                        setError(true);
                      }
                    },
                  });
                }}
              >
                <FaTrash />
              </ActionIcon>
            </ActionIcon.Group>
          </Flex>
        </Container>
      </Flex>
    </>
  );
}
