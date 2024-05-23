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
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { FaHtml5, FaPlus } from "react-icons/fa";
import { CHeading } from "@codeup/components/dist/global/CHeading";

export default function Projects() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

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

                alert(x);
              },
              variant: "brand",
            },
          ]}
          entries={[]}
        />
      </Box>
    </>
  );
}
