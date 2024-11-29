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
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";
import {
  RiGitRepositoryFill,
  RiGitRepositoryPrivateFill,
} from "react-icons/ri";
import { useTranslation } from "next-i18next";
import { FaPlus } from "react-icons/fa";
import PopupManager from "@codeup/web/src/global/PopupManager";

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

    setLoading(false);

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
      <HStack
        justifyContent={"flex-end"}
        display={props.user.username === props.username ? "flex" : "none"}
      >
        <Button
          variant={"brand"}
          leftIcon={<FaPlus />}
          onClick={async () => {
            await PopupManager.alertAsync({
              title: t("repos.create"),
              description: (
                <>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      const fd = new FormData(e.target as HTMLFormElement);

                      const ip = (
                        document.querySelector(
                          "#repo-is-public"
                        ) as HTMLInputElement
                      ).checked;

                      const res = await REST.Repositories.createRepository(
                        AccountManager.getActiveToken(),
                        {
                          name: fd.get("name") as string,
                          description: fd.get("description") as string,
                          isPublic: ip,
                          deploymentType: fd.get("deploymentType") as string,
                          deploymentName: fd.get("deploymentName") as string,
                          templateURL:
                            "https://github.com/CodeUpProjects/empty",
                        }
                      );

                      if (res.status !== 200) {
                        await PopupManager.alertAsync({
                          title: t("base:control.error"),
                          description:
                            t("base:control.error.request") + res.payload.error,
                        });
                        return;
                      }

                      PopupManager.removeCurrentPopup();

                      await reload();
                    }}
                  >
                    <Stack gap={4}>
                      <FormControl isRequired>
                        <FormLabel>{t("repos.create.name")}</FormLabel>
                        <Input
                          name={"name"}
                          placeholder={t("repos.create.name")}
                        />
                        <FormHelperText>
                          {t("repos.create.name.helper")}
                        </FormHelperText>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>{t("repos.create.description")}</FormLabel>
                        <Textarea
                          name={"description"}
                          placeholder={t("repos.create.description")}
                        />
                        <FormHelperText>
                          {t("repos.create.description.helper")}
                        </FormHelperText>
                      </FormControl>
                      <FormControl>
                        <FormLabel>{t("repos.create.public")}</FormLabel>
                        <Switch id={"repo-is-public"} colorScheme={"brand"} />
                        <FormHelperText>
                          {t("repos.create.public.helper")}
                        </FormHelperText>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>{t("repos.create.deploy.type")}</FormLabel>
                        <Select name={"deploymentType"}>
                          <option value={"static"}>Static (HTML)</option>
                          <option value={"dynamic"}>
                            Dynamic (Next.JS/Server/...)
                          </option>
                        </Select>
                        <FormHelperText>
                          {t("repos.create.deploy.type.helper")}
                        </FormHelperText>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>{t("repos.create.deploy.name")}</FormLabel>
                        <InputGroup>
                          <Input
                            name={"deploymentName"}
                            placeholder={t("repos.create.deploy.name")}
                          />
                          <InputRightAddon>.codexp.dev</InputRightAddon>
                        </InputGroup>
                        <FormHelperText>
                          {t("repos.create.deploy.name.helper")}
                        </FormHelperText>
                      </FormControl>
                      <Button
                        type={"submit"}
                        variant={"brand"}
                        leftIcon={<FaPlus />}
                      >
                        {t("repos.create.submit")}
                      </Button>
                    </Stack>
                  </form>
                </>
              ),
            });
          }}
        >
          {t("repos.create")}
        </Button>
      </HStack>
      <Stack gap={4} pt={4}>
        {repos.map((repo, i) => (
          <>
            <HStack
              key={i}
              bg={"gray.900"}
              rounded={"md"}
              p={4}
              alignItems={"center"}
              gap={4}
            >
              <Text fontSize={"4xl"}>
                {repo.public ? (
                  <RiGitRepositoryFill />
                ) : (
                  <RiGitRepositoryPrivateFill />
                )}
              </Text>
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
