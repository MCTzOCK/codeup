/**
 * apps/web/src/pages/ide/project/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.07.2022
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import redirect from "@codeup/util/src/userworkflow/redirect";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  IconButton,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import {
  FaCloudUploadAlt,
  FaCogs,
  FaEye,
  FaFile,
  FaUserFriends,
} from "react-icons/fa";

export default function Index() {
  const router = useRouter();
  const toast = useToast();
  const [errorAlert, setErrorAlert] = useState<{
    show: boolean;
    error: string;
  }>({
    show: false,
    error: "",
  });

  const [project, setProject] = useState<{
    _id: string;
    owner: string;
    name: string;
    contributors: {
      user: string;
      permissions: string[];
    }[];
    files: {
      path: string;
      content: string;
      _id: string;
    }[];
  } | null>(null);

  useEffect(() => {
    redirect({
      forceAnonymous: false,
      allowAnonymous: false,
      redirectTo: router.pathname,
      redirectToLogin: true,
    });
  }, [router]);

  useEffect(() => {
    if (router.query.id) {
      fetch("/api/ide/projects/" + router.query.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
        }),
      }).then((res) => {
        res.json().then((data) => {
          if (res.status === 200) {
            setProject(data.project);
          } else {
            setErrorAlert({
              error: data.error,
              show: true,
            });
          }
        });
      });
    }
  }, [router]);

  return (
    <>
      {errorAlert.show ? (
        <Alert status="error" variant={"top-accent"}>
          <AlertIcon />
          <AlertTitle>Fehler!</AlertTitle>
          <AlertDescription>{errorAlert.error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <Flex
            direction={"row"}
            w={"100%"}
            minH={"100vh"}
            id={"editor-wrapper-flex"}
          >
            <Box
              flex={"5%"}
              minH={"90vh"}
              bgColor={"gray.900"}
              w={"100%"}
              margin={"2rem"}
              rounded={"xl"}
              shadow={"2xl"}
            >
              <Flex direction={"column"}>
                <Tooltip label={"Dateien"} placement={"right"} hasArrow>
                  <IconButton
                    aria-label={""}
                    variant="ghost"
                    size={"lg"}
                    p={"2rem"}
                    icon={<FaFile />}
                    rounded={"none"}
                    roundedTopLeft={"xl"}
                    roundedTopRight={"xl"}
                  />
                </Tooltip>
                <Tooltip label={"Mitwirkende"} placement={"right"} hasArrow>
                  <IconButton
                    aria-label={""}
                    variant="ghost"
                    size={"lg"}
                    p={"2rem"}
                    icon={<FaUserFriends />}
                    rounded={"none"}
                  />
                </Tooltip>
                <Tooltip label={"Einstellungen"} placement={"right"} hasArrow>
                  <IconButton
                    aria-label={""}
                    variant="ghost"
                    size={"lg"}
                    p={"2rem"}
                    icon={<FaCogs />}
                    rounded={"none"}
                  />
                </Tooltip>
                <Tooltip label={"Veröffentlichen"} placement={"right"} hasArrow>
                  <IconButton
                    aria-label={""}
                    variant="ghost"
                    size={"lg"}
                    p={"2rem"}
                    icon={<FaCloudUploadAlt />}
                    rounded={"none"}
                  />
                </Tooltip>
                <Tooltip label={"Vorschau"} placement={"right"} hasArrow>
                  <IconButton
                    aria-label={""}
                    variant="ghost"
                    size={"lg"}
                    p={"2rem"}
                    icon={<FaEye />}
                    rounded={"none"}
                  />
                </Tooltip>
              </Flex>
            </Box>
            <Box
              flex={"95%"}
              minH={"90vh"}
              bgColor={"gray.900"}
              w={"100%"}
              margin={"2rem"}
              rounded={"xl"}
              shadow={"2xl"}
            ></Box>
          </Flex>
        </>
      )}
    </>
  );
}
