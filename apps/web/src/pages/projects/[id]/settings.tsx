/**
 * apps/web/src/pages/projects/[id]/settings.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.06.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../../types/IProject";
import { IWikiPage } from "../../../types/IWikiPage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/dist/editorv2/EditorProjectLayout";
import {
  Box,
  Button,
  chakra,
  Flex,
  Grid,
  HStack,
  Text,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Table,
} from "@chakra-ui/react";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import {
  FaClock,
  FaExternalLinkAlt,
  FaEye,
  FaPen,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";
import { CHeading } from "@codeup/components/dist/global/CHeading";

export default function Settings() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const [project, setProject] = React.useState<IProject | null>(null);
  const [currentDeployment, setCurrentDeployment] = React.useState<{
    state: string;
    createdAt: number;
  } | null>(null);
  const [currentBuild, setCurrentBuild] = React.useState<{
    status: number;
    name: string;
    id: string;
    startedAt?: string;
    endedAt?: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then(async (res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
        reload();
      } else {
        PopupManager.alertAsync({
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const reload = async () => {
    const res = await REST.Projects.Deployment.getCurrentDeployment(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (res.status === 200) {
      setCurrentDeployment({
        state: res.payload.state,
        createdAt: res.payload.createdAt,
      });
    }
  };

  React.useEffect(() => {
    if (!router.query.id) {
      return;
    }
    const i = setInterval(async () => {
      const res = await REST.Projects.Deployment.getBuildJobs({
        token: AccountManager.getActiveToken(),
        id: router.query.id as string,
        latest: true,
      });

      if (res.status === 200) {
        setCurrentBuild(res.payload.job);
        if (res.payload.job && res.payload.job.status === 3) {
          reload();
        }
      }
    }, 1500);

    return () => {
      clearInterval(i);
    };
  }, [router.query.id]);

  return (
    <>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={4}>
          <Flex justifyContent={"center"}>
            <Box textAlign={"center"} maxW={"500px"}>
              <CHeading size={"lg"}>Einstellungen</CHeading>
              <Text textAlign={"center"}>
                Hier kannst du dein Projekt veröffentlichen oder andere
                projektbezogene Einstellungen vornehmen. Beachte, dass du dein
                Projekt nur aus der Projektübersicht löschen kannst.
              </Text>
            </Box>
          </Flex>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
            gap={4}
            mt={4}
          >
            <Box rounded={"md"} bg={"gray.900"} p={2}>
              <CHeading size={"md"}>Aktueller Status</CHeading>
              {currentDeployment ? (
                <>
                  <Text>
                    Dein Projekt verfügt über eine Veröffentlichung. Der
                    aktuelle Status ist:{" "}
                    {currentDeployment.state === "running" ? (
                      <HStack color={"green.600"} alignItems={"center"}>
                        <FaEye />
                        <Text>Online</Text>
                      </HStack>
                    ) : (
                      <HStack color={"red.500"} alignItems={"center"}>
                        <FaTimesCircle />
                        <Text>Offline</Text>
                      </HStack>
                    )}
                  </Text>
                  {currentDeployment.state === "running" && (
                    <>
                      <Button
                        variant={"brand"}
                        mt={2}
                        leftIcon={<FaExternalLinkAlt />}
                        onClick={() => {
                          window.open(
                            `https://${(project as IProject)._id}.codeup.space`,
                            "_blank"
                          );
                        }}
                      >
                        Öffnen
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Text>
                    Es wurde kein Deployment gefunden. Wenn dies ein Fehler ist,
                    versuche es bitte erneut zu veröffentlichen oder kontaktiere
                    den Support.
                  </Text>
                </>
              )}
            </Box>
            <Box rounded={"md"} bg={"gray.900"} p={2}>
              <CHeading size={"md"}>Neue Veröffentlichung</CHeading>
              <Text>
                Veröffentliche dein Projekt neu, um die aktuellste Version zu
                präsentieren. Beachte, dass dies einige Minuten dauern kann.
                Sobald du die Veröffentlichung startest, erhältst du
                Statusmeldungen. Bei einem erfolgreichen Abschluss wird jede
                vorherige Veröffentlichung ersetzt und Änderungen sind sofort
                sichtbar.
              </Text>
              <Button
                variant={"brand"}
                mt={4}
                leftIcon={<FaPlus />}
                onClick={async () => {
                  const res = await REST.Projects.Deployment.startBuildJob(
                    AccountManager.getActiveToken(),
                    router.query.id as string
                  );

                  if (res.status !== 200) {
                    PopupManager.alertAsync({
                      title: "Fehler",
                      description:
                        "Die Veröffentlichung konnte nicht gestartet werden: " +
                        res.payload.error,
                    });
                  } else {
                    PopupManager.alertAsync({
                      title: "Erfolg",
                      description:
                        "Die Veröffentlichung wurde gestartet. Du erhältst in Kürze Statusmeldungen.",
                    });
                  }
                }}
              >
                Neue Veröffentlichung
              </Button>
              <Box mt={2}>
                {currentBuild && (
                  <>
                    <CHeading size={"sm"}>Aktueller Build</CHeading>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>ID</Th>
                          <Th>Startzeit</Th>
                          <Th>Endzeit</Th>
                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>{currentBuild.name}</Td>
                          <Td>{currentBuild.id}</Td>
                          <Td>
                            {currentBuild.startedAt &&
                              new Date(
                                currentBuild.startedAt as string
                              ).toLocaleString()}
                          </Td>
                          <Td>
                            {currentBuild.endedAt &&
                              new Date(currentBuild.endedAt).toLocaleString()}
                          </Td>
                          <Td>
                            <Text>
                              {currentBuild.status === 0
                                ? "Das Build wird vorbereitet"
                                : currentBuild.status === 1
                                ? "Das Build wurde gestartet"
                                : currentBuild.status === 2
                                ? "Das Build wird veröffentlicht"
                                : currentBuild.status === 3
                                ? "Das Build wurde erfolgreich abgeschlossen"
                                : currentBuild.status === 4
                                ? "Das Build wurde durch einen Fehler beendet"
                                : "Unbekannter Status"}
                            </Text>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </>
                )}
              </Box>
            </Box>
          </Grid>
        </Box>
      </EditorProjectLayout>
    </>
  );
}
