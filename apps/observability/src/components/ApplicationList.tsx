/**
 * apps/observability/src/components/ApplicationList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.10.2024
 *
 */

import * as React from "react";
import { useEffect } from "react";
import RestClient from "@/rest/RestClient";
import {
  Box,
  Button,
  FileInput,
  Flex,
  Input,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { FaFileImage, FaPlus } from "react-icons/fa6";
import { modals } from "@mantine/modals";
import { useRouter } from "next/router";

export default function ApplicationList() {
  const [error, setError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  const [apps, setApps] = React.useState<
    {
      name: string;
      _id: string;
      username: string;
      logo?: string;
      url: string;
    }[]
  >([]);

  const router = useRouter();

  useEffect(() => {
    if (!RestClient.hasToken()) {
      return;
    }
    reload();
  }, [RestClient.hasToken()]);

  const reload = () => {
    RestClient.getApplications().then((res) => {
      if (res.status === 200) {
        setApps(res.payload.data);
      } else {
        console.error(res);
        setError(true);
      }
      setLoading(false);
    });
  };

  if (loading) {
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
      <Stack gap={"md"}>
        <Button
          leftSection={<FaPlus />}
          onClick={async () => {
            modals.open({
              title: "Create Application",
              centered: true,
              children: (
                <>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const fd = new FormData(e.target as HTMLFormElement);

                      const { name, url, logo } = Object.fromEntries(fd);

                      const fr = new FileReader();

                      fr.onload = async () => {
                        const res = await RestClient.createApplication({
                          name: name as string,
                          url: url as string,
                          logo: fr.result as string,
                        });
                        if (res.status === 200) {
                          reload();
                          modals.closeAll();
                        } else {
                          modals.open({
                            title: "Error",
                            centered: true,
                            children: (
                              <Text c={"red"}>
                                An error occurred while creating the
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
                      <Input placeholder={"Name"} name={"name"} required />
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
                      required
                    />
                    <Button
                      type={"submit"}
                      color={"blue"}
                      variant={"light"}
                      mt={"md"}
                      w={"100%"}
                      leftSection={<FaPlus />}
                    >
                      Create
                    </Button>
                  </form>
                </>
              ),
              size: "md",
            });
          }}
          color={"blue"}
          variant={"light"}
        >
          Create Application
        </Button>
        {apps.map((app) => (
          <>
            <Flex
              key={app._id}
              p={"md"}
              align={"center"}
              gap={"lg"}
              style={{
                display: "flex",
                cursor: "pointer",
                borderRadius: "var(--mantine-radius-lg)",
                textDecoration: "none",
                color: "#FFF",
              }}
              bg={(() => {
                if (router.pathname === "/app/applications/[id]") {
                  if (router.query.id === app._id) {
                    return "blue.8";
                  } else {
                    return "gray.9";
                  }
                } else {
                  return "gray.9";
                }
              })()}
              component={"a"}
              href={"/app/applications/" + app._id}
              onClick={(e) => {
                e.preventDefault();
                router.push("/app/applications/" + app._id);
              }}
            >
              <img
                src={app.logo}
                alt={app.name}
                style={{
                  height: 48,
                  width: 48,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <Stack gap={"0"}>
                <Text
                  size={"lg"}
                  style={{
                    fontWeight: "600",
                  }}
                >
                  {app.name}
                </Text>
                <Text size={"sm"}>{app.url}</Text>
              </Stack>
            </Flex>
          </>
        ))}
      </Stack>
    </>
  );
}
