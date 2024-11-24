/**
 * packages/components/v2/UserPageRepositoryList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.11.2024
 *
 */

import * as React from "react";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import AuthenticateLoadingIndicator from "../admin/AuthenticateLoadingIndicator";
import { Box, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import {
  RiGitRepositoryFill,
  RiGitRepositoryPrivateFill,
} from "react-icons/ri";
import { useTranslation } from "next-i18next";

export default function UserPageRepositoryList(props: {
  username: string;
  user: any;
}) {
  const { t } = useTranslation();
  const [repos, setRepos] = React.useState<
    {
      name: string;
      user: string;
      username: string;
      description: string;
      public: boolean;
      deploymentType: string;
      deploymentName: string;
    }[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    if (!props.username) return;
    reload();
  }, [props.username]);

  const reload = async () => {
    const res = await REST.Repositories.getRepositories(
      props.username,
      AccountManager.getActiveToken()
    );

    if (res.status !== 200) {
      setError(res.payload.error);
      return;
    }

    setRepos(res.payload.data);
  };

  if (loading) {
    return <AuthenticateLoadingIndicator />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <>
      <Stack gap={4}>
        {repos.map((repo, i) => (
          <>
            <HStack
              key={i}
              bg={"gray.900"}
              rounded={"md"}
              p={4}
              alignItems={"center"}
              gap={2}
            >
              {repo.public ? (
                <RiGitRepositoryFill />
              ) : (
                <RiGitRepositoryPrivateFill />
              )}
              <Box as={"a"} href={"/u/" + props.username + "/" + repo.name}>
                <Heading size={"lg"}>
                  @{props.username}/{repo.name}
                </Heading>
                <Text>{repo.description}</Text>
              </Box>
            </HStack>
          </>
        ))}
        {repos.length === 0 && <Text>{t("repos.none")}</Text>}
      </Stack>
    </>
  );
}
