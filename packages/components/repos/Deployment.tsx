/**
 * packages/components/repos/Deployment.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.12.2024
 *
 */

import * as React from "react";
import { useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { useTranslation } from "next-i18next";
import { FaExternalLinkAlt, FaRocket } from "react-icons/fa";
import { IoReload } from "react-icons/io5";

export default function Deployment(props: {
  repoId: string;
  deploymentName: string;
  deploymentType: string;
}) {
  const [logs, setLogs] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");
  const [deploying, setDeploying] = React.useState<boolean>(false);
  const [has, setHas] = React.useState<boolean>(false);
  const { t } = useTranslation("user-page");

  useEffect(() => {
    if (!props.repoId) return;

    reload();
  }, [props.repoId]);

  const reload = async () => {
    const hasRes = await REST.Repositories.hasDeployment(
      AccountManager.getActiveToken(),
      props.repoId
    );

    if (hasRes.status === 200) {
      setHas(hasRes.payload.hasContainer);
    } else {
      setHas(false);
    }

    const logsRes = await REST.Repositories.deployLogs(
      AccountManager.getActiveToken(),
      props.repoId
    );

    if (logsRes.status === 200) {
      setLogs(logsRes.payload.logs);
    } else {
      setLogs("Could not fetch logs");
    }

    const statusRes = await REST.Repositories.deployStatus(
      AccountManager.getActiveToken(),
      props.repoId
    );

    if (statusRes.status === 200) {
      setStatus(statusRes.payload.containerStatus);
    } else {
      setStatus("Could not fetch status");
    }
  };

  return (
    <>
      <Box w={"100%"} minH={"80vh"} display={"flex"} justifyContent={"center"}>
        <Box w={"100%"} maxW={"1600px"} rounded={"lg"} bg={"gray.900"} p={4}>
          <HStack justifyContent={"space-between"}>
            <Heading size={"md"}>{t("repos.deploy.title")}</Heading>
            <Button
              variant={"brand"}
              leftIcon={<FaRocket />}
              isLoading={deploying}
              onClick={async () => {
                setDeploying(true);
                setStatus("Please wait, your deployment is starting");
                const res = await REST.Repositories.deployRepo(
                  AccountManager.getActiveToken(),
                  props.repoId
                );

                if (res.status === 200) {
                  await reload();
                } else {
                  setStatus("Could not deploy");
                }
                setDeploying(false);
              }}
            >
              {t("repos.deploy")}
            </Button>
          </HStack>
          <Text mt={4}>{t("repos.deploy.text")}</Text>
          {has ? (
            <>
              <Button
                mt={4}
                leftIcon={<FaExternalLinkAlt />}
                variant={"brand"}
                as={"a"}
                target={"_blank"}
                href={`https://${props.deploymentName}.user-content.dev`}
              >
                {t("repos.deploy.open")}
              </Button>
              <HStack mt={4} alignItems={"flex-start"} spacing={4}>
                <Text>{t("repos.deploy.status")}</Text>
                <IconButton
                  variant={"ghost"}
                  colorScheme={"brand"}
                  aria-label={"Reload"}
                  icon={<IoReload />}
                  onClick={reload}
                  size={"sm"}
                />
              </HStack>
              <Text>{status}</Text>
              <Text mt={4}>{t("repos.deploy.logs")}</Text>
              <pre>
                <code>{logs}</code>
              </pre>
            </>
          ) : (
            <>
              <Text mt={4}>{t("repos.deploy.no.deployment")}</Text>
            </>
          )}
        </Box>
      </Box>
    </>
  );
}
