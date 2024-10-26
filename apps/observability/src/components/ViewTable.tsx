/**
 * apps/observability/src/components/ViewTable.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.10.2024
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { VIEWS_PAGINATED } from "@/gql/queries";
import { useEffect } from "react";
import { Center, Container, em, Pagination, Table } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function ViewTable() {
  const [pages, setPages] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const router = useRouter();
  const { loading, error, data, refetch, client } = useQuery(VIEWS_PAGINATED, {
    variables: {
      page: page,
      applicationId: router.query.id,
    },
  });

  useEffect(() => {
    if (!loading && data) {
      setPages(data.PageViewPagination.totalPages);
      if (data.PageViewPagination.data.length === 0) {
        setPage(1);
      }
      if (page > data.PageViewPagination.totalPages) {
        setPage(data.PageViewPagination.totalPages);
      }
    }
  }, [loading, error, data]);

  return (
    <>
      <Container
        p={"md"}
        fluid
        bg={"var(--mantine-color-dark-9)"}
        style={{
          borderRadius: "var(--mantine-radius-md)",
          gridColumn: isMobile ? "1" : "span 3",
          width: "100%",
          maxWidth: window.innerWidth - 105,
        }}
      >
        {loading ||
        !data ||
        !data.PageViewPagination ||
        !data.PageViewPagination.data ? (
          <p>Loading...</p>
        ) : (
          <>
            <Table.ScrollContainer minWidth={320}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>URL</Table.Th>
                    <Table.Th>User Agent</Table.Th>
                    <Table.Th>Browser</Table.Th>
                    <Table.Th>OS</Table.Th>
                    <Table.Th>Language</Table.Th>
                    <Table.Th>Screen Resolution</Table.Th>
                    <Table.Th>Viewport</Table.Th>
                    <Table.Th>IP</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.PageViewPagination.data.map((view: any) => (
                    <Table.Tr key={view._id}>
                      <Table.Td>
                        {new Date(view.createdAt).toLocaleString()}
                      </Table.Td>
                      <Table.Td>{view.url}</Table.Td>
                      <Table.Td>{view.userAgent}</Table.Td>
                      <Table.Td>{view.browser}</Table.Td>
                      <Table.Td>{view.os}</Table.Td>
                      <Table.Td>{view.language}</Table.Td>
                      <Table.Td>{view.screenResolution}</Table.Td>
                      <Table.Td>{view.viewport}</Table.Td>
                      <Table.Td>{view.ip}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
            <Center>
              <Pagination total={pages} value={page} onChange={setPage} />
            </Center>
          </>
        )}
      </Container>
    </>
  );
}
