/**
 * apps/web/src/pages/projects/[id]/uml.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.06.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { useRouter } from "next/router";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { IProject } from "../../../types/IProject";
import { useEffect } from "react";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/editorv2/EditorProjectLayout";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import {
  FaClock,
  FaCode,
  FaExchangeAlt,
  FaEye,
  FaHtml5,
  FaPlus,
  FaSitemap,
  FaTrash,
} from "react-icons/fa";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { FaCube, FaHardDrive } from "react-icons/fa6";
import byteSize from "byte-size";

export default function UML() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const [project, setProject] = React.useState<IProject | null>(null);
  const [umls, setUmls] = React.useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then((res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
        reloadUmls();
      } else {
        PopupManager.alertAsync({
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const reloadUmls = async () => {
    const res = await REST.Projects.umlDiagrams(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (res.status === 200) {
      setUmls(res.payload.umls);
    } else {
      PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Die UML-Diagramme konnten nicht empfangen werden: " +
          res.payload.error,
      });
    }
  };

  const uml_types: {
    name: string;
    description: string;
    icon: any;
    identifier: string;
  }[] = [
    {
      name: "Implementation",
      description:
        "Ein Implementationsdiagramm in dem Klassen und Methoden dargestellt werden.",
      icon: <FaCube />,
      identifier: "impl",
    },
    {
      name: "ER-Diagramm",
      description:
        "Ein ER-Diagramm zur Darstellung von Entitäten und Beziehungen.",
      icon: <FaSitemap />,
      identifier: "er",
    },
    {
      name: "Sequenz",
      description:
        "Ein Sequenzdiagramm zur Darstellung von Abläufen und Methodenaufrufen.",
      icon: <FaExchangeAlt />,
      identifier: "seq",
    },
    {
      name: "Erweitert",
      description:
        "Ein erweitertes UML-Diagramm für Profis. (Nicht empfohlen für Anfänger)",
      icon: <FaCode />,
      identifier: "adv",
    },
  ];

  return (
    <>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={2}>
          <GridLayoutV2
            pageTitle={"UML-Diagramme"}
            search={{
              show: true,
              fields: true,
            }}
            topButtons={[
              {
                text: "Neu",
                variant: "brand",
                onClick: async () => {
                  const name = await PopupManager.promptAsync({
                    title: "Neues Diagramm",
                    helperText: "Bitte gib den Namen des neuen Diagramms ein.",
                  });

                  if (!name) return;

                  const x = await new Promise(async (resolve) => {
                    await PopupManager.alertAsync({
                      title: "Neues Diagramm",
                      description: (
                        <>
                          <Text>Bitte wählen den Typ des Diagramms aus.</Text>
                          <Grid
                            templateColumns={[
                              "repeat(1, 1fr)",
                              "repeat(2, 1fr)",
                            ]}
                            pt={6}
                            gap={4}
                          >
                            {uml_types.map((type) => (
                              <>
                                <Box
                                  bg={"#000"}
                                  rounded={"xl"}
                                  cursor={"pointer"}
                                  _hover={{
                                    outline: "1px solid #F7DE1F",
                                  }}
                                  p={4}
                                  onClick={async () => {
                                    resolve(type.identifier);
                                    PopupManager.removeCurrentPopup();
                                  }}
                                >
                                  <Flex
                                    fontSize={"4xl"}
                                    w={"100%"}
                                    justifyContent={"center"}
                                    color={"white"}
                                    align={"center"}
                                  >
                                    {type.icon}
                                  </Flex>
                                  <Box mt={2} textAlign={"center"}>
                                    <CHeading size={"md"}>{type.name}</CHeading>
                                  </Box>
                                  <Text
                                    fontSize={"sm"}
                                    color={"white"}
                                    textAlign={"center"}
                                    mt={2}
                                  >
                                    {type.description}
                                  </Text>
                                </Box>
                              </>
                            ))}
                          </Grid>
                        </>
                      ),
                    });
                  });

                  if (!x) return;

                  const res = await REST.Projects.createUmlDiagram(
                    AccountManager.getActiveToken(),
                    router.query.id as string,
                    name,
                    JSON.stringify({}),
                    x as string
                  );

                  if (res.status !== 200) {
                    await PopupManager.alertAsync({
                      title: "Fehler",
                      description:
                        "Das Diagramm konnte nicht erstellt werden: " +
                        res.payload.error,
                    });
                    return;
                  }

                  await reloadUmls();
                },
                leftIcon: <FaPlus />,
              },
            ]}
            entries={umls.map((u) => ({
              title: u.name,
              buttonRows: [
                [
                  {
                    text: "Öffnen",
                    onClick: () => {
                      router.push(
                        "/projects/" +
                          router.query.id +
                          "/uml/" +
                          u._id +
                          "?type=" +
                          u.type
                      );
                    },
                    leftIcon: <FaEye />,
                    variant: "brand",
                  },
                  {
                    text: "Löschen",
                    onClick: async () => {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: "Löschen",
                          question:
                            "Möchtest du das Diagramm wirklich löschen?",
                        }))
                      )
                        return;

                      const res = await REST.Projects.deleteUmlDiagram(
                        AccountManager.getActiveToken(),
                        router.query.id as string,
                        u._id
                      );

                      if (res.status !== 200) {
                        await PopupManager.alertAsync({
                          title: "Fehler",
                          description:
                            "Das Diagramm konnte nicht gelöscht werden: " +
                            res.payload.error,
                        });
                        return;
                      }

                      await reloadUmls();
                    },
                    leftIcon: <FaTrash />,
                    colorScheme: "red",
                  },
                ],
              ],
              fields: [
                {
                  text:
                    "Erstellt am: " + new Date(u.createdAt).toLocaleString(),
                  icon: <FaClock />,
                },
                {
                  text:
                    "Typ: " +
                    (uml_types.find((t) => t.identifier === u.type)?.name ??
                      "Unbekannt"),
                  icon: uml_types.find((t) => t.identifier === u.type)
                    ?.icon ?? <FaHtml5 />,
                },
                {
                  text:
                    "Gespeicherte Daten: " + byteSize(u.data.length).toString(),
                  icon: <FaHardDrive />,
                },
              ],
            }))}
          />
        </Box>
      </EditorProjectLayout>
    </>
  );
}
