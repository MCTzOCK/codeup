/**
 * apps/web/src/pages/u/[username]/[repo].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.11.2024
 *
 */

import * as React from "react";
import { useLoggedIn, useUserLoggedInRedirect } from "@codeup/hooks";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { sProp } from "../../../global/i18nstaticProps";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import {
  RiGitRepositoryFill,
  RiGitRepositoryPrivateFill,
} from "react-icons/ri";
import { BiDotsHorizontalRounded, BiDotsVerticalRounded } from "react-icons/bi";
import { FaPen, FaTrash } from "react-icons/fa";
import PopupManager from "../../../global/PopupManager";

export default function RepoViewer() {
  const { t } = useTranslation("user-page");

  const [repo, setRepo] = React.useState<{
    createdAt: string;
    user: string;
    username: string;
    name: string;
    description: string;
    public: boolean;
    deploymentType: string;
    deploymentName: string;
    lastDeployment: string;
  } | null>(null);

  const { userInfo } = useLoggedIn();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const reload = async () => {
    const res = await REST.Repositories.getRepository(
      router.query.username as string,
      router.query.repo as string,
      AccountManager.getActiveToken()
    );

    if (res.status !== 200) {
      setError(res.payload.error);
      setLoading(false);
      return;
    }

    setRepo(res.payload.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!router.query.username || !router.query.repo) return;
    reload();
  }, [router.query.username, router.query.repo]);

  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  if (loading) {
    return <AuthenticateLoadingIndicator />;
  }

  if (error) {
    return <ErrorComponent description={error} />;
  }

  if (!repo) {
    return <AuthenticateLoadingIndicator />;
  }

  return (
    <>
      <Box w={"100%"} minH={"100vh"} h={"fit-content"}>
        <HStack
          bg={"gray.900"}
          rounded={"md"}
          p={4}
          alignItems={"center"}
          gap={4}
          justifyContent={"space-between"}
          direction={{
            base: "column",
            md: "row",
          }}
        >
          <HStack gap={4}>
            <Text fontSize={"4xl"}>
              {repo.public ? (
                <RiGitRepositoryFill />
              ) : (
                <RiGitRepositoryPrivateFill />
              )}
            </Text>
            <Heading size={"lg"}>
              @{router.query.username}/{repo.name}
            </Heading>
          </HStack>
          <Menu>
            <MenuButton
              as={IconButton}
              variant={"brand"}
              aria-label={"actions"}
              icon={<BiDotsHorizontalRounded />}
              display={repo.username === userInfo.username ? "flex" : "none"}
            />
            <MenuList>
              <MenuItem icon={<FaPen />}>{t("repo.actions.edit")}</MenuItem>
              <MenuItem
                icon={<FaTrash />}
                color={"red.500"}
                onClick={async () => {
                  if (
                    !(await PopupManager.confirmAsync({
                      title: t("repos.delete"),
                      question: t("repos.delete.confirm"),
                    }))
                  )
                    return;

                  const res = await REST.Repositories.deleteRepository(
                    AccountManager.getActiveToken(),
                    repo.username,
                    repo.name
                  );

                  if (res.status === 200) {
                    router.push("/u/" + repo.username);
                  } else {
                    await PopupManager.alertAsync({
                      title: t("base:control.error"),
                      description:
                        t("base:control.error.request") + res.payload.error,
                    });
                  }
                }}
              >
                {t("repo.actions.delete")}
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
        <Box p={4}>
          <Box rounded={"md"} p={4} bg={"gray.900"} w={"100%"}></Box>
        </Box>
      </Box>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["user-page"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
