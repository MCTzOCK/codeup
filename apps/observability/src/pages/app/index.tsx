/**
 * apps/observability/src/pages/app/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.10.2024
 *
 */

import * as React from "react";
import { Text, Title, Box, Flex, Container, Anchor } from "@mantine/core";

export default function Index() {
  return (
    <>
      <Flex
        w={"100%"}
        h={"100%"}
        justify={"center"}
        align={"center"}
        style={{
          minHeight: "90vh",
        }}
      >
        <Container
          size={"xl"}
          bg={"gray.9"}
          p={"lg"}
          style={{
            borderRadius: "var(--mantine-radius-lg)",
          }}
        >
          <Title order={1}>Welcome!</Title>
          <Text size="xl">
            Welcome to CodeUp Observability! With CodeUp Observability you can
            monitor your applications and get recordings of your users sessions.
            To start please create or pick an application from the sidebar. This
            platform is part of the CodeUp project and is currently under active
            development, so expect some issues or unfinished features. For any
            questions, feedback or issues please contact us at&nbsp;
            <Anchor href="mailto:ben@codeup.space">ben@codeup.space</Anchor>. If
            you don't know about the main project, CodeUp, please visit our
            website at&nbsp;
            <Anchor href="https://codeup.space">https://codeup.space</Anchor>.
            <br />~ Ben Siebert
          </Text>
        </Container>
      </Flex>
    </>
  );
}
