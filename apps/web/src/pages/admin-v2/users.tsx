/**
 * apps/web/src/pages/mantine/admin-v2/users.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.10.2024
 *
 */

import * as React from "react";
import { useEffect } from "react";
import AdminLayout from "../../global/mantine-components/AdminLayout";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Modal,
  Container,
  Group,
  Input,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
  Title,
  TextInput,
  Divider,
  Switch,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaEye, FaLock, FaSave, FaTrash } from "react-icons/fa";
import {
  DELETE_USER,
  gatherToken,
  USERS_PAGINATED,
  USERS_UPDATE,
} from "./queries";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { FaChartSimple } from "react-icons/fa6";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../global/PopupManager";
import { useRouter } from "next/router";

export default function Users() {
  const [pages, setPages] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const [query, setQuery] = React.useState<string>("");
  const [gqlToken, setGqlToken] = React.useState<string>("");
  const [items, setItems] = React.useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [current, setCurrent] = React.useState<any>({});
  const [client, setClient] = React.useState<ApolloClient<any> | null>(null);
  const router = useRouter();

  useEffect(() => {
    gatherToken(setGqlToken);
  }, []);

  useEffect(() => {
    if (!gqlToken) {
      return;
    }
    reloadData();
  }, [page, query, gqlToken]);

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
      query: USERS_PAGINATED,
      variables: {
        page,
        filter: query,
      },
    });

    setItems(res.data.UserPagination.items);
    setPages(res.data.UserPagination.pageInfo.pageCount);
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
          <Group
            mt="md"
            mb="xs"
            style={{
              width: "100%",
            }}
          >
            <Input
              mb={"md"}
              placeholder={"Search"}
              value={query}
              onChange={(e: any) => {
                setQuery(e.currentTarget.value);
              }}
              flex={"1"}
            />
          </Group>
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 5 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
            mb={"md"}
          >
            {items.map((item) => (
              <Card shadow={"sm"} padding={"lg"} radius={"md"} withBorder>
                <Center>
                  <Avatar
                    src={"/api/account/" + item.username + "/picture"}
                    size={"xl"}
                    alt={item.username}
                  />
                </Center>
                <Group justify="space-between" mt="md" mb="xs">
                  <Stack gap={0}>
                    <Title order={3} style={{ margin: 0 }}>
                      {item.firstName} {item.lastName}
                    </Title>
                    <Text fw={500}>@{item.username}</Text>
                  </Stack>
                  <Badge
                    color={
                      item.role === "admin"
                        ? "red"
                        : item.role === "creator"
                        ? "blue"
                        : "gray"
                    }
                  >
                    {item.role}
                  </Badge>
                </Group>

                <Text size={"sm"} c={"dimmed"}>
                  This user has registered with the email {item.email} at&nbsp;
                  {new Date(item.createdAt).toLocaleString()}.
                </Text>
                <Button
                  leftSection={<FaEye />}
                  radius={"md"}
                  fullWidth
                  mt={"md"}
                  onClick={() => {
                    setCurrent(item);
                    open();
                  }}
                >
                  Details
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
          title={current ? current.username : "No user selected"}
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
                    mutation: USERS_UPDATE,
                    variables: {
                      id: current._id,
                      record: {
                        email: fd.get("email"),
                        firstName: fd.get("firstName"),
                        lastName: fd.get("lastName"),
                        role: fd.get("role"),
                        subscription: fd.get("pro") ? "PRO" : "FREE",
                        active: fd.get("active") === "on",
                      },
                    },
                  });

                  if (res.data.UserUpdateById.recordId) {
                    reloadData();
                    close();
                  }
                }}
              >
                <Stack gap={"md"}>
                  <TextInput
                    label={"Username"}
                    disabled
                    value={current.username}
                  />
                  <TextInput
                    label={"Created At"}
                    disabled
                    value={new Date(current.createdAt).toLocaleString()}
                  />
                  <TextInput label={"SSO"} disabled value={current.sso} />
                  <TextInput
                    label={"E-Mail"}
                    value={current.email}
                    name={"email"}
                  />
                  <Group>
                    <TextInput
                      label={"First Name"}
                      defaultValue={current.firstName}
                      name={"firstName"}
                    />
                    <TextInput
                      label={"Last Name"}
                      defaultValue={current.lastName}
                      name={"lastName"}
                    />
                  </Group>
                  <TextInput
                    label={"Role"}
                    defaultValue={current.role}
                    name={"role"}
                  />
                  <Group>
                    <Switch
                      defaultChecked={current.subscription === "PRO"}
                      label={"CodeUp PRO"}
                      name={"pro"}
                    />
                    <Switch
                      defaultChecked={current.active}
                      label={"Account active"}
                      name={"active"}
                    />
                  </Group>
                  <Button
                    radius={"md"}
                    leftSection={<FaSave />}
                    type={"submit"}
                  >
                    Save
                  </Button>
                  <Divider
                    my={"xs"}
                    label={"Admin Actions"}
                    labelPosition={"center"}
                  />
                  <Group gap={"md"} justify={"center"}>
                    <ActionIcon
                      variant={"filled"}
                      aria-label={"Delete"}
                      color={"red"}
                      size={"lg"}
                      onClick={async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: "Delete user",
                            question:
                              "Are you sure you want to delete the user?",
                          }))
                        )
                          return;

                        if (!client) return;

                        const res = await client.mutate({
                          mutation: DELETE_USER,
                          variables: {
                            id: current._id,
                          },
                        });

                        if (res.data.UserRemoveById.recordId) {
                          reloadData();
                          close();
                        } else if (res.data.UserRemoveById.error) {
                          PopupManager.alert({
                            title: "Error",
                            description: res.data.UserRemoveById.error.message,
                          });
                        }
                      }}
                    >
                      <FaTrash />
                    </ActionIcon>
                    <ActionIcon
                      variant={"filled"}
                      aria-label={"Analytics"}
                      size={"lg"}
                      onClick={() => {
                        router.push("/admin-v2/analytics/" + current._id);
                      }}
                    >
                      <FaChartSimple />
                    </ActionIcon>
                    <ActionIcon
                      variant={"filled"}
                      aria-label={"Login as user"}
                      size={"lg"}
                      onClick={async () => {
                        const jwtRes = await REST.Admin.getUserJWT({
                          token: localStorage.getItem("token") as string,
                          username: current.username,
                        });

                        if (jwtRes.status === 200) {
                          await AccountManager.setActiveToken(
                            jwtRes.payload.jwt
                          );
                          window.location.href = "/";
                        } else {
                          PopupManager.alert({
                            title: "Fehler",
                            description: jwtRes.payload.error,
                          });
                        }
                      }}
                    >
                      <FaLock />
                    </ActionIcon>
                  </Group>
                </Stack>
              </form>
            </>
          )}
          {!current && (
            <>
              <Text>
                No user selected. Please select a user to view details.
              </Text>
            </>
          )}
        </Modal>
      </AdminLayout>
    </>
  );
}

Users.noLayout = true;
