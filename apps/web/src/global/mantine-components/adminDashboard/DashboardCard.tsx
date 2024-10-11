/**
 * apps/web/src/global/mantine-components/adminDashboard/DashboardCard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.10.2024
 *
 */

import * as React from "react";
import { useQuery } from "@apollo/client";
import { Container, Group, Text, Title } from "@mantine/core";

export default function DashboardCard(props: {
  title: string;
  description: string;
  renderContent: (data: any) => React.ReactNode;
  gqlQuery: any;
  customVariables: any;
  style?: any;
}) {
  const { loading, error, data } = useQuery(props.gqlQuery, {
    variables: props.customVariables,
  });
  return (
    <>
      <Container
        p={"md"}
        fluid
        bg={"var(--mantine-color-dark-7)"}
        style={{
          borderRadius: "var(--mantine-radius-md)",
          width: "100%",
          height: "100%",
          ...props.style,
        }}
      >
        <Group justify={"space-between"}>
          <Title order={3}>{props.title}</Title>
        </Group>
        <Text size={"sm"} c={"dimmed"}>
          {props.description}
        </Text>
        {loading || !data ? (
          <Text>Loading...</Text>
        ) : (
          <>{props.renderContent(data)}</>
        )}
      </Container>
    </>
  );
}
