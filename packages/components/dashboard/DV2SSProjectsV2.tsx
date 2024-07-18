/**
 * packages/components/dashboard/DV2SSProjectsV2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.07.2024
 *
 */

import * as React from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { Badge, Box, Flex, Grid, Text } from "@chakra-ui/react";
import router from "next/router";
import { CHeading } from "../global/CHeading";
import byteSize from "byte-size";

export default function DV2SSProjectsV2() {
  const [projects, setProjects] = React.useState<
    {
      _id: string;
      owner: string;
      name: string;
      discovery: boolean;
      discoveryDescription: string;
      customDomain: string;
      contributors: any[];
      updated_at: string;
      created_at: string;
      __v: number;
      discoveryLikes: string[];
      discoveryComments: any[];
    }[]
  >([]);

  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    reloadProjects();
  }, []);

  const reloadProjects = async () => {
    const res = await REST.Editor.getProjectsV2(
      AccountManager.getActiveToken()
    );

    if (res.status !== 200) {
      setError("Fehler beim Laden der Projekte: " + res.payload.error);
      return;
    }

    setProjects(res.payload.projects);
  };

  return (
    <>
      {error && (
        <>
          <Flex justifyContent={"center"} p={4}>
            {error}
          </Flex>
        </>
      )}
      <Grid
        templateColumns={[
          "repeat(1, 1fr)",
          "repeat(2, 1fr)",
          "repeat(3, 1fr)",
          "repeat(4, 1fr)",
        ]}
        gap={4}
      >
        {projects.map((project) => (
          <Box
            bg={"gray.700"}
            rounded={"lg"}
            p={4}
            cursor={"pointer"}
            onClick={() => {
              router.push("/editor/" + project._id);
            }}
          >
            <CHeading size={"md"}>{project.name}</CHeading>
            <Text fontSize={"md"}>
              {new Date(project.created_at).toLocaleString()}
            </Text>
            <Text fontSize={"md"}>
              {project.contributors.length} Mitwirkende
            </Text>
            <Badge mt={2} variant={"brand"}>
              {project.discovery ? "Veröffentlicht" : "Privat"}
            </Badge>
          </Box>
        ))}
        {projects.length === 0 && (
          <>
            <Box
              bg={"brand.500"}
              color={"black"}
              fontSize={"lg"}
              fontWeight={600}
              rounded={"lg"}
              p={4}
              cursor={"pointer"}
              onClick={() => {
                router.push("/ide");
              }}
            >
              Du hast noch kein Projekt erstellt! Klicke um ein neues Projekt zu
              erstellen.
            </Box>
          </>
        )}
      </Grid>
    </>
  );
}
