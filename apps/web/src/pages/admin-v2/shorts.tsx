/**
 * apps/web/src/pages/admin-v2/shorts.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.10.2024
 *
 */

import * as React from "react";
import { gql, useQuery } from "@apollo/client";
import { SHORTS_MANY } from "./queries";
import AdminLayout from "../../global/mantine-components/AdminLayout";
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import moment from "moment";
import PopupManager from "../../global/PopupManager";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function Shorts() {
  const { loading, error, data, client, refetch } = useQuery(SHORTS_MANY);

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

                const codeupUrl = await PopupManager.promptAsync({
                  title: "CodeUp URL",
                  helperText:
                    "Enter the URL suffix (e.g. test for codeup.space/test)",
                });

                if (!codeupUrl) return;

                const destUrl = await PopupManager.promptAsync({
                  title: "Destination URL",
                  helperText: "Enter the destination URL",
                });

                if (!destUrl) return;

                const res = await client.mutate({
                  mutation: gql`
                    mutation CreateShort(
                      $short: String!
                      $destination: String!
                    ) {
                      ShortURLCreate(
                        record: { short: $short, destination: $destination }
                      ) {
                        recordId
                        record {
                          createdAt
                          destination
                          short
                          _id
                        }
                        error {
                          message
                        }
                      }
                    }
                  `,
                  variables: {
                    short: codeupUrl,
                    destination: destUrl,
                  },
                });

                if (res.errors) {
                  PopupManager.alert({
                    title: "Error",
                    description: res.errors[0].message,
                  });
                  return;
                }

                refetch();
              }}
              leftSection={<FaPlus />}
            >
              Create Short
            </Button>
          </Group>
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 5 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
            mb={"md"}
          >
            {loading || !data ? (
              <>Loading...</>
            ) : (
              (data as any).ShortURLMany.map((item: any) => (
                <Card shadow={"sm"} padding={"lg"} radius={"md"} withBorder>
                  <Group justify="space-between" mb="xs">
                    <Stack gap={0}>
                      <Title order={3} style={{ margin: 0 }}>
                        {item.short}
                      </Title>
                    </Stack>
                    <Badge color={"blue"}>
                      {moment(item.createdAt).format("DD.MM.YYYY")}
                    </Badge>
                  </Group>

                  <Text size={"sm"} c={"dimmed/*"}>
                    {item.destination}
                  </Text>

                  <Button
                    onClick={async () => {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: "Delete Short",
                          question:
                            "Are you sure you want to delete this short URL?",
                        }))
                      )
                        return;
                      if (!client) return;

                      const res = await client.mutate({
                        mutation: gql`
                          mutation DeleteShort($id: MongoID!) {
                            ShortURLRemoveById(_id: $id) {
                              recordId
                            }
                          }
                        `,
                        variables: {
                          id: item._id,
                        },
                      });

                      if (res.errors) {
                        PopupManager.alert({
                          title: "Error",
                          description: res.errors[0].message,
                        });
                        return;
                      }

                      refetch();
                    }}
                    leftSection={<FaTrash />}
                    radius={"md"}
                    fullWidth
                    mt={"md"}
                    color={"red"}
                  >
                    Delete
                  </Button>
                </Card>
              ))
            )}
          </SimpleGrid>
        </Container>
      </AdminLayout>
    </>
  );
}

Shorts.noLayout = true;
