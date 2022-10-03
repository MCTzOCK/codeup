/**
 * packages/components/global/UserAuthSSO.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.09.2022
 *
 */

import * as React from "react";
import {
  Button,
  ButtonGroup,
  Grid,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaDiscord, FaGithub, FaGitlab, FaMicrosoft } from "react-icons/fa";
import { useRouter } from "next/router";

export default function UserAuthSSO() {
  const router = useRouter();

  return (
    <>
      <Stack spacing={4}>
        <Button
          colorScheme={"gray"}
          onClick={() => {
            router.push("/api/sso/request?type=github");
          }}
          leftIcon={<FaGithub />}
          size={"lg"}
        >
          GitHub
        </Button>
        <Button
          colorScheme={"gray"}
          onClick={() => {
            router.push("/api/sso/request?type=gitlab");
          }}
          leftIcon={<FaGitlab />}
          size={"lg"}
        >
          GitLab
        </Button>
        <Button
          colorScheme={"gray"}
          onClick={() => {
            router.push("/api/sso/request?type=discord");
          }}
          leftIcon={<FaDiscord />}
          size={"lg"}
        >
          Discord
        </Button>
      </Stack>
    </>
  );
}
