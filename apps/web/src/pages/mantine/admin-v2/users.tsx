/**
 * apps/web/src/pages/mantine/admin-v2/users.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.10.2024
 *
 */

import * as React from "react";
import AdminLayout from "../../../global/mantine-components/AdminLayout";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import {
  Card,
  Center,
  Container,
  Pagination,
  SimpleGrid,
  Table,
  Stack,
  Group,
  Text,
  Input,
  Badge,
  Avatar,
  Title,
} from "@mantine/core";

export default function Users() {
  const [pages, setPages] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const [query, setQuery] = React.useState<string>("");
  const [queryKey, setQueryKey] = React.useState<string>("username");
  const [records, setRecords] = React.useState<any[]>([]);
  const model = "User";

  useEffect(() => {
    reloadData();
  }, []);

  useEffect(() => {
    reloadData();
  }, [page, query]);

  const reloadData = async () => {
    const res = await REST.Admin.paginateData({
      token: AccountManager.getActiveToken(),
      model,
      page,
      query,
      queryKey,
    });

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: "Error",
        description: res.payload.error,
      });
      return;
    }

    setRecords(res.payload.records);
    setPages(res.payload.pages);
    if (page > res.payload.pages) {
      setPage(res.payload.pages);
    }
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
          <Input
            mb={"md"}
            placeholder={"Search"}
            value={query}
            onChange={(e: any) => {
              setQuery(e.currentTarget.value);
            }}
          />
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 5 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
          >
            {records.map((record) => (
              <Card shadow={"sm"} padding={"lg"} radius={"md"} withBorder>
                <Center>
                  <Avatar
                    src={"/api/account/" + record.username + "/picture"}
                    size={"xl"}
                    alt={record.username}
                  />
                </Center>
                <Group justify="space-between" mt="md" mb="xs">
                  <Stack gap={0}>
                    <Title order={3} style={{ margin: 0 }}>
                      {record.firstName} {record.lastName}
                    </Title>
                    <Text fw={500}>@{record.username}</Text>
                  </Stack>
                  <Badge
                    color={
                      record.role === "admin"
                        ? "red"
                        : record.role === "creator"
                        ? "blue"
                        : "gray"
                    }
                  >
                    {record.role}
                  </Badge>
                </Group>

                <Text size={"sm"} c={"dimmed"}>
                  This user has registered with the email {record.email}{" "}
                  at&nbsp;
                  {new Date(record.createdAt).toLocaleString()}.
                </Text>
              </Card>
            ))}
          </SimpleGrid>

          <Center>
            <Pagination total={pages} value={page} onChange={setPage} />
          </Center>
        </Container>
      </AdminLayout>
    </>
  );
}
