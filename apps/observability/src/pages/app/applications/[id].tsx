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
  Anchor,
  Box,
  Button,
  Container,
  em,
  FileInput,
  Flex,
  Input,
  Loader,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  FaChevronRight,
  FaFileImage,
  FaPen,
  FaPlus,
  FaTrash,
} from "react-icons/fa6";
import { modals } from "@mantine/modals";
import { FaSave } from "react-icons/fa";
import ScriptTagExplanation from "@/components/ScriptTagExplanation";
import CardWithChart from "@/components/CardWithChart";
import { SR_CREATED, VIEWS_CREATED } from "@/gql/queries";
import { BarChart, LineChart } from "@mantine/charts";
import { useMediaQuery } from "@mantine/hooks";

export default function Application() {
  const router = useRouter();
  const [error, setError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

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
          size={"xl"}
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
          <Flex align={"center"} justify={"center"} w={"100%"} mt={"md"}>
            <Container
              style={{
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                width: "100%",
              }}
              bg={"gray.8"}
            >
              <Title order={3}>Adding to your Web-App</Title>
              <Text>
                To add the CodeUp Observer to your web application, you need to
                include the platform-specific code snippet.
              </Text>
              <ScriptTagExplanation appId={app._id} />
            </Container>
          </Flex>
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <CardWithChart
              title={"Views"}
              description={"Views of your application in the given time period"}
              renderContent={(data) => (
                <>
                  <b>{data.PageViewCount}</b> views have registered in
                  total.&nbsp;
                  <Anchor
                    href={`/app/applications/${app._id}/views`}
                    style={{
                      alignItems: "center",
                      display: "inline-flex",
                    }}
                    onClick={(e: any) => {
                      e.preventDefault();
                      router.push(`/app/applications/${app._id}/views`);
                    }}
                  >
                    View all <FaChevronRight size={"0.9rem"} />
                  </Anchor>
                </>
              )}
              renderChart={(data) => (
                <>
                  <LineChart
                    pt={"lg"}
                    h={300}
                    data={data.PageViewChartCreated.map((item: any) => ({
                      Views: item.count,
                      date: item.id,
                    }))}
                    dataKey={"date"}
                    withLegend
                    series={[
                      {
                        name: "Views",
                        color: "blue.6",
                      },
                    ]}
                    tickLine={"xy"}
                    gridAxis={"xy"}
                    withXAxis={true}
                  />
                </>
              )}
              gqlQuery={VIEWS_CREATED}
              customVariables={{
                applicationId: app._id,
              }}
            />
            <CardWithChart
              title={"Replays"}
              description={
                "Session replays of your application in the given time period"
              }
              renderContent={(data) => (
                <>
                  <b>{data.SReplayCount}</b> sessions have been recorded.&nbsp;
                  <Anchor
                    href={`/app/applications/${app._id}/replays`}
                    style={{
                      alignItems: "center",
                      display: "inline-flex",
                    }}
                    onClick={(e: any) => {
                      e.preventDefault();
                      router.push(`/app/applications/${app._id}/replays`);
                    }}
                  >
                    View all <FaChevronRight size={"0.9rem"} />
                  </Anchor>
                </>
              )}
              renderChart={(data) => (
                <>
                  <LineChart
                    pt={"lg"}
                    h={300}
                    data={data.SReplayChartCreated.map((item: any) => ({
                      Sessions: item.count,
                      date: item.id,
                    }))}
                    dataKey={"date"}
                    withLegend
                    series={[
                      {
                        name: "Sessions",
                        color: "red.6",
                      },
                    ]}
                    tickLine={"xy"}
                    gridAxis={"xy"}
                    withXAxis={true}
                  />
                </>
              )}
              gqlQuery={SR_CREATED}
              customVariables={{
                applicationId: app._id,
              }}
            />
          </Box>
        </Container>
      </Flex>
    </>
  );
}
