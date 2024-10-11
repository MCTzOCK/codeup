/**
 * apps/web/src/pages/admin-v2/errors.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.10.2024
 *
 */

import * as React from "react";
import AdminLayout from "../../global/mantine-components/AdminLayout";
import { useQuery } from "@apollo/client";
import { ERRORS_PAGINATED } from "./queries";
import { useEffect } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { FaEye } from "react-icons/fa";
import moment from "moment";

export default function Errors() {
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const { loading, error, data } = useQuery(ERRORS_PAGINATED, {
    variables: {
      page: page,
    },
  });

  useEffect(() => {
    if (!loading && data) {
      setPages(data.ErrorModelPagination.pageInfo.pageCount);
      if (data.ErrorModelPagination.items.length === 0) {
        setPage(1);
      }
      if (page > data.ErrorModelPagination.pageInfo.pageCount) {
        setPage(data.ErrorModelPagination.pageInfo.pageCount);
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
              (data as any).ErrorModelPagination.items.map((item: any) => (
                <Card shadow={"sm"} padding={"lg"} radius={"md"} withBorder>
                  <Group justify="space-between" mt="md" mb="xs">
                    <Stack gap={0}>
                      <Title order={3} style={{ margin: 0 }}>
                        {item.name}
                      </Title>
                      <Text>{item.message}</Text>
                    </Stack>
                    <Badge color={"red"}>
                      {moment(item.createdAt).format("DD.MM.YYYY")}
                    </Badge>
                  </Group>

                  <Text
                    size={"sm"}
                    c={"dimmed"}
                    style={{
                      overflow: "auto",
                    }}
                  >
                    <pre>{item.stack}</pre>
                  </Text>
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

Errors.noLayout = true;
