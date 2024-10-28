/**
 * apps/observability/src/pages/app/applications/[id]/replays.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.10.2024
 *
 */

import * as React from "react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { SREPLAY_ITEM, SReplays_PAGINATED } from "@/gql/queries";
import {
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  Modal,
  Pagination,
  Portal,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { FaEye } from "react-icons/fa6";
import { useDisclosure, useId } from "@mantine/hooks";
import UAParser from "ua-parser-js";
import { modals } from "@mantine/modals";
import * as rrweb from "rrweb";
import * as rrwebPlayer from "rrweb-player";

export default function Replays() {
  const [pages, setPages] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [current, setCurrent] = React.useState<any>(null);
  const { loading, error, data, refetch, client } = useQuery(
    SReplays_PAGINATED,
    {
      variables: {
        page: page,
        applicationId: router.query.id,
      },
    }
  );

  useEffect(() => {
    if (!loading && data) {
      setPages(data.SReplayPagination.totalPages);
      if (data.SReplayPagination.data.length === 0) {
        setPage(1);
      }
      if (page > data.SReplayPagination.totalPages) {
        setPage(data.SReplayPagination.totalPages);
      }
    }
  }, [loading, error, data]);

  return (
    <>
      <Container
        p={"lg"}
        bg={"var(--mantine-color-dark-7)"}
        m={"lg"}
        style={{
          borderRadius: "var(--mantine-radius-md)",
        }}
        fluid
      >
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 5 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
          mb={"md"}
        >
          {loading || !data ? (
            <>Loading...</>
          ) : (
            (data as any).SReplayPagination.data.map((item: any) => (
              <Card shadow={"sm"} padding={"lg"} radius={"md"} withBorder>
                <Group justify="space-between" mt="md" mb="xs">
                  <Stack gap={0}>
                    <Title order={3} style={{ margin: 0 }}>
                      {new UAParser(item.userAgent).getResult().browser.name}
                    </Title>
                    <Text fw={500}>{item.userAgent}</Text>
                  </Stack>
                  <Badge color={"blue"}>
                    {new Date(item.sessionStarted).toLocaleString()}
                  </Badge>
                </Group>

                <Text size={"sm"} c={"dimmed"}>
                  The session was recorded on{" "}
                  {new Date(item.createdAt).toLocaleString()}. For more
                  information, click on the view button.
                </Text>
                <Button
                  leftSection={<FaEye />}
                  radius={"md"}
                  fullWidth
                  mt={"md"}
                  onClick={async () => {
                    const res = await client.query({
                      query: SREPLAY_ITEM,
                      variables: {
                        id: item._id,
                        applicationId: router.query.id,
                      },
                    });
                    if (res.data.SReplayById) {
                      setCurrent(res.data.SReplayById);
                      open();

                      setTimeout(() => {
                        const eventsDeepCopy = JSON.parse(
                          JSON.stringify(res.data.SReplayById.events)
                        );

                        const player = new rrwebPlayer.default({
                          target: document.getElementById(
                            "rrweb-replayer-div"
                          ) as HTMLDivElement,
                          props: {
                            events: eventsDeepCopy as any,
                            autoPlay: true,
                            skipInactive: false,
                          },
                        });
                      }, 500);
                    } else {
                      modals.open({
                        title: "Error",
                        children: (
                          <>
                            <Text>
                              The session could not be loaded. Please try again
                              later.
                            </Text>
                          </>
                        ),
                        centered: true,
                      });
                    }
                  }}
                >
                  View
                </Button>
              </Card>
            ))
          )}
        </SimpleGrid>

        <Center>
          <Pagination total={pages} value={page} onChange={setPage} />
        </Center>
      </Container>

      <Modal
        opened={opened}
        onClose={close}
        title={
          current
            ? "Session at " + new Date(current.sessionStarted).toLocaleString()
            : "No session selected"
        }
        fullScreen
        radius={0}
        transitionProps={{
          transition: "pop",
          duration: 200,
        }}
      >
        <div
          id={"rrweb-replayer-div"}
          style={{
            height: "calc(100vh - 200px)",
            width: "100%",
            overflow: "hidden",
            backgroundColor: "var(--mantine-color-dark-9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--mantine-radius-lg)",
          }}
        ></div>
        {!current && (
          <>
            <Text>
              No session selected. Please select a session to view the details.
            </Text>
          </>
        )}
      </Modal>
    </>
  );
}
