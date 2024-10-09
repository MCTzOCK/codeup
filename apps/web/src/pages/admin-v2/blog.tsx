/**
 * apps/web/src/pages/admin-v2/blog.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.10.2024
 *
 */

import * as React from "react";
import { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useRouter } from "next/router";
import {
  BLOGS_CREATE,
  BLOGS_PAGINATED,
  BLOGS_UPDATE,
  DELETE_BLOG,
  gatherToken,
} from "./queries";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  Modal,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { FaPen, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import AdminLayout from "../../global/mantine-components/AdminLayout";
import { useLoggedIn } from "@codeup/hooks";
import PopupManager from "../../global/PopupManager";

export default function Blog() {
  const [pages, setPages] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const [gqlToken, setGqlToken] = React.useState<string>("");
  const [items, setItems] = React.useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [current, setCurrent] = React.useState<any>({});
  const [client, setClient] = React.useState<ApolloClient<any> | null>(null);
  const router = useRouter();
  const { userInfo } = useLoggedIn();

  useEffect(() => {
    gatherToken(setGqlToken);
  }, []);

  useEffect(() => {
    if (!gqlToken) {
      return;
    }
    reloadData();
  }, [page, gqlToken]);

  const reloadData = async () => {
    const client = new ApolloClient({
      uri: "https://gql.codeup.space",
      cache: new InMemoryCache(),
      headers: {
        authorization: gqlToken,
      },
    });
    setClient(client);

    const res = await client.query({
      query: BLOGS_PAGINATED,
      variables: {
        page,
      },
    });

    setItems(res.data.BlogPagination.items);
    setPages(res.data.BlogPagination.pageInfo.pageCount);
  };
  return (
    <>
      <AdminLayout>
        <Container
          p={"lg"}
          bg={"var(--mantine-color-dark-7)"}
          m={"lg"}
          style={{
            borderRadius: "var(--mantine-radius-md)",
          }}
          fluid
        >
          <Group justify={"flex-end"}>
            <Button
              onClick={async () => {
                if (!client) return;

                const res = await client.mutate({
                  mutation: BLOGS_CREATE,
                  variables: {
                    record: {
                      title: "New Blog",
                      tags: ["new", "blog"],
                      content: "# New Blog",
                      authorUsername: userInfo.username,
                      published_at: new Date(),
                    },
                  },
                });

                if (res.data.BlogCreate.recordId) {
                  reloadData();
                  setCurrent(res.data.BlogCreate.record);
                  open();
                } else {
                  await PopupManager.alertAsync({
                    title: "Error",
                    description: "Could not create blog.",
                  });
                }
              }}
              leftSection={<FaPlus />}
            >
              Create Blog
            </Button>
          </Group>
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 5 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
            mb={"md"}
          >
            {items.map((item) => (
              <Card shadow={"sm"} padding={"lg"} radius={"md"} withBorder>
                <Group justify={"space-between"}>
                  <Title order={3} style={{ margin: 0 }}>
                    {item.title}
                  </Title>
                  <ActionIcon
                    color={"red"}
                    aria-label={"Delete Blog"}
                    onClick={async () => {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: "Delete Blog",
                          question:
                            "Are you sure you want to delete this blog?",
                        }))
                      )
                        return;
                      if (!client) return;

                      const res = await client.mutate({
                        mutation: DELETE_BLOG,
                        variables: {
                          id: item._id,
                        },
                      });

                      if (res.data.BlogUpdateById.recordId) {
                        reloadData();
                      } else {
                        await PopupManager.alertAsync({
                          title: "Error",
                          description: "Could not delete blog.",
                        });
                      }
                    }}
                  >
                    <FaTrash />
                  </ActionIcon>
                </Group>
                <Group justify="space-between" mt="md" mb="xs">
                  <Stack gap={0}>
                    <Text fw={500}>
                      {item.tags.map((t: string) => `#${t}`).join(", ")}
                    </Text>
                  </Stack>
                  <Badge>@{item.authorUsername}</Badge>
                </Group>

                <Text size={"sm"} c={"dimmed"}>
                  This blog was published at{" "}
                  <b>{new Date(item.published_at).toLocaleString()}</b>
                </Text>
                <Button
                  leftSection={<FaPen />}
                  radius={"md"}
                  fullWidth
                  mt={"md"}
                  onClick={() => {
                    setCurrent(item);
                    open();
                  }}
                >
                  Edit
                </Button>
              </Card>
            ))}
          </SimpleGrid>

          <Center>
            <Pagination total={pages} value={page} onChange={setPage} />
          </Center>
        </Container>

        <Modal
          opened={opened}
          onClose={close}
          title={current ? current.title : "No blog selected"}
          size={"auto"}
        >
          {current && (
            <>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const fd = new FormData(e.target as HTMLFormElement);

                  if (!client) return;

                  const res = await client.mutate({
                    mutation: BLOGS_UPDATE,
                    variables: {
                      id: current._id,
                      record: {
                        title: fd.get("title"),
                        tags: (fd.get("tags") as string).split(","),
                        content: fd.get("content"),
                        authorUsername: current.authorUsername,
                      },
                    },
                  });

                  if (res.data.BlogUpdateById.recordId) {
                    reloadData();
                    close();
                  }
                }}
              >
                <Stack
                  gap={"md"}
                  miw={{
                    base: "80vw",
                    sm: "40vw",
                  }}
                >
                  <TextInput
                    label={"Title"}
                    name={"title"}
                    defaultValue={current.title}
                  />
                  <TextInput
                    label={"Tags (comma separated)"}
                    name={"tags"}
                    defaultValue={(current.tags || []).join(",")}
                  />
                  <TextInput
                    label={"Published at"}
                    disabled
                    value={new Date(current.published_at).toLocaleString()}
                  />

                  <Textarea
                    label={"Content"}
                    description={"The content of the blog in markdown format."}
                    defaultValue={current.content}
                    placeholder={"# Hello World"}
                    name={"content"}
                    autosize
                    resize={"vertical"}
                  />
                  <Button
                    radius={"md"}
                    leftSection={<FaSave />}
                    type={"submit"}
                  >
                    Save
                  </Button>
                </Stack>
              </form>
            </>
          )}
          {!current && (
            <>
              <Text>No blog selected. Please select a blog to view edit.</Text>
            </>
          )}
        </Modal>
      </AdminLayout>
    </>
  );
}

Blog.noLayout = true;
