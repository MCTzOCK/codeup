/**
 * apps/web/src/pages/projects/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.05.2024
 *
 */

import * as React from "react";
import { Box, chakra, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../types/IProject";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../global/PopupManager";
import GridLayoutV2 from "@codeup/components/global/GridLayoutV2";
import {
  FaClock,
  FaCode,
  FaDownload,
  FaHtml5,
  FaInfo,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { useRouter } from "next/router";
import { RiNextjsFill } from "react-icons/ri";
import { SiExpress, SiVite } from "react-icons/si";

export default function Projects() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const router = useRouter();

  const [projects, setProjects] = React.useState<IProject[]>([]);

  const reload = async () => {
    const res = await REST.Projects.myProjects(AccountManager.getActiveToken());

    if (res.status === 200) {
      setProjects(res.payload.data);
    } else {
      await PopupManager.alertAsync({
        title: "Fehler",
        description: res.payload.error,
      });
    }
  };

  React.useEffect(() => {
    reload();
  }, []);

  const project_types: {
    name: string;
    description: string;
    icon: any;
    identifier: string;
  }[] = [
    {
      name: "Statisch",
      description:
        "Ein statisches Projekt (HTML, CSS, JavaScript, keine Server-Logik)",
      icon: <FaHtml5 />,
      identifier: "static",
    },
    {
      name: "Vite.js",
      description: "Eine leere Vite.js (React) App (keine Server-Logik)",
      icon: <SiVite />,
      identifier: "vite-react",
    },
    {
      name: "Express.js",
      description: "Eine leere Express.js App (ausschließlich Server-Logik)",
      icon: <SiExpress />,
      identifier: "express",
    },
  ];

  return (
    <>
      <Box minH={"100vh"} h={"fit-content"} bg={"#000"}>
        <GridLayoutV2
          pageTitle={"Projekte"}
          search={{
            show: true,
            fields: true,
          }}
          topButtons={[
            {
              text: "Neu",
              leftIcon: <FaPlus />,
              onClick: async () => {
                const name = await PopupManager.promptAsync({
                  title: "Neues Projekt",
                  helperText: "Bitte geben Sie den Namen des Projekts ein.",
                });

                if (!name) return;

                const x = await new Promise(async (resolve) => {
                  await PopupManager.alertAsync({
                    title: "Projekt-Typ wählen",
                    description: (
                      <>
                        <Text>
                          Bitte wähle den Typ des Projektes aus. Du kannst
                          diesen später nicht mehr ändern, also wähle weise.
                        </Text>
                        <Grid
                          templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
                          pt={6}
                          gap={4}
                        >
                          {project_types.map((type) => (
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

                const res = await REST.Projects.createProject({
                  token: AccountManager.getActiveToken(),
                  name,
                  projectType: x as string,
                  modifiers: ["private"],
                });

                await reload();
              },
              variant: "brand",
            },
          ]}
          entries={projects.map((p) => ({
            title: p.name,
            fields: [
              {
                icon: <FaCode />,
                text: "Vorlage: " + p.projectType,
              },
              {
                icon: <FaInfo />,
                text: "ID: " + p._id,
              },
              {
                icon: <FaClock />,
                text: "Erstellt: " + new Date(p.createdAt).toLocaleString(),
              },
            ],
            buttonRows: [
              [
                {
                  text: "Öffnen",
                  onClick: () => {
                    router.push("/projects/" + p._id);
                  },
                  leftIcon: <FaCode />,
                  variant: "brand",
                },
                {
                  text: "Löschen",
                  onClick: async () => {
                    if (
                      !(await PopupManager.confirmAsync({
                        title: "Projekt löschen",
                        question: "Möchten Sie das Projekt wirklich löschen?",
                      }))
                    )
                      return;

                    const res = await REST.Projects.deleteProject(
                      AccountManager.getActiveToken(),
                      p._id
                    );

                    if (res.status === 200) {
                      await reload();
                    } else {
                      await PopupManager.alertAsync({
                        title: "Fehler",
                        description: res.payload.error,
                      });
                    }
                  },
                  leftIcon: <FaTrash />,
                  colorScheme: "red",
                },
              ],
              [
                {
                  text: "Exportieren",
                  onClick: async () => {
                    window.open(
                      "/api/projects/" +
                        p._id +
                        "/download?token=" +
                        AccountManager.getActiveToken()
                    );
                  },
                  leftIcon: <FaDownload />,
                  variant: "brand",
                },
              ],
            ],
          }))}
        />
      </Box>
    </>
  );
}
