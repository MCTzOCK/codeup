/**
 * apps/web/src/pages/admin-v2/contacts.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.10.2024
 *
 */

import * as React from "react";
import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { CONTACTS_PAGINATED } from "./queries";
import AdminLayout from "../../global/mantine-components/AdminLayout";
import {
  Badge,
  Card,
  Center,
  Container,
  Group,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Button,
} from "@mantine/core";
import moment from "moment/moment";
import { FaEnvelope, FaTrash } from "react-icons/fa";
import PopupManager from "../../global/PopupManager";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";

export default function Contacts() {
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const { client, loading, error, refetch, data } = useQuery(
    CONTACTS_PAGINATED,
    {
      variables: {
        page: page,
      },
    }
  );

  useEffect(() => {
    if (!loading && data) {
      setPages(data.ContactPagination.pageInfo.pageCount);
      if (data.ContactPagination.items.length === 0) {
        setPage(1);
      }
      if (page > data.ContactPagination.pageInfo.pageCount) {
        setPage(data.ContactPagination.pageInfo.pageCount);
      }
    }
  }, [loading, error, data]);

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
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 5 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
            mb={"md"}
          >
            {loading || !data ? (
              <>Loading...</>
            ) : (
              (data as any).ContactPagination.items.map((item: any) => (
                <Card shadow={"sm"} padding={"lg"} radius={"md"} withBorder>
                  <Group justify="space-between" mb="xs">
                    <Stack gap={0}>
                      <Title order={3} style={{ margin: 0 }}>
                        {item.username}
                      </Title>
                      <Text>{moment(item.createdAt).format("DD.MM.YYYY")}</Text>
                    </Stack>
                    <Badge
                      color={
                        item.category === "fehler"
                          ? "red"
                          : item.category === "feature"
                          ? "green"
                          : item.category === "creator"
                          ? "blue"
                          : "gray"
                      }
                    >
                      {item.category}
                    </Badge>
                  </Group>

                  <Text size={"sm"} c={"dimmed"}>
                    {item.message}
                  </Text>
                  <Button
                    onClick={async () => {
                      const answer = await PopupManager.promptAsync({
                        title: "Answer",
                        helperText: "Please enter your answer",
                        inputType: "TEXTAREA",
                      });

                      if (!answer) {
                        return;
                      }

                      const res = await REST.Admin.contactUser({
                        token: AccountManager.getActiveToken(),
                        message: answer,
                        username: item.username,
                      });

                      if (res.status !== 200) {
                        await PopupManager.alertAsync({
                          title: "Error",
                          description:
                            "An error occurred: " + res.payload.error,
                        });
                        return;
                      }

                      await PopupManager.alertAsync({
                        title: "Success",
                        description: "The message was sent successfully.",
                      });
                    }}
                    leftSection={<FaEnvelope />}
                    radius={"md"}
                    fullWidth
                    mt={"md"}
                  >
                    Answer
                  </Button>
                  <Button
                    onClick={async () => {
                      const res = await client.mutate({
                        mutation: gql`
                          mutation DELETE_CONTACT($id: MongoID!) {
                            ContactRemoveById(_id: $id) {
                              recordId
                              record {
                                _id
                              }
                              error {
                                message
                              }
                            }
                          }
                        `,
                        variables: {
                          id: item._id,
                        },
                      });

                      if (res.errors) {
                        await PopupManager.alertAsync({
                          title: "Error",
                          description:
                            "An error occurred: " + res.errors[0].message,
                        });
                        return;
                      }

                      await PopupManager.alertAsync({
                        title: "Success",
                        description: "The message was deleted successfully.",
                      });

                      refetch();
                    }}
                    leftSection={<FaTrash />}
                    radius={"md"}
                    color={"red"}
                    fullWidth
                    mt={"md"}
                  >
                    Delete
                  </Button>
                </Card>
              ))
            )}
          </SimpleGrid>

          <Center>
            <Pagination total={pages} value={page} onChange={setPage} />
          </Center>
        </Container>
      </AdminLayout>
    </>
  );
}

Contacts.noLayout = true;
