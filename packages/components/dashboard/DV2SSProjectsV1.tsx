/**
 * packages/components/dashboard/DV2SSProjectsV1.tsx
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
import { CHeading } from "../global/CHeading";
import byteSize from "byte-size";
import router from "next/router";

export default function DV2SSProjectsV1() {
  const [projects, setProjects] = React.useState<
    {
      _id: string;
      owner: string;
      name: string;
      pinned: string[];
      published: boolean;
      publishedCustomName: string;
      discovery: boolean;
      discoveryDescription: string;
      contributors: any[];
      files: any[];
      stats: {
        total_files: number;
        total_contributors: number;
        total_size: number;
      };
      created_at: string;
      updated_at: string;
    }[]
  >([]);

  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    reloadProjects();
  }, []);

  const reloadProjects = async () => {
    const res = await REST.IDE.getProjects({
      token: AccountManager.getActiveToken(),
      type: "ALL",
      withStats: true,
    });

    if (res.status !== 200) {
      setError("Fehler beim Laden der Projekte: " + res.payload.error);
      return;
    }

    //3wsa  setProjects(res.payload.projects);
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
              router.push(
                "/ide/project/" + project._id + "#editor-wrapper-flex"
              );
            }}
          >
            <CHeading size={"md"}>{project.name}</CHeading>
            <Text fontSize={"md"}>
              {new Date(project.created_at).toLocaleString()}
            </Text>
            <Text fontSize={"md"}>{project.stats.total_files} Dateien</Text>
            <Text fontSize={"md"}>
              {project.stats.total_contributors} Mitwirkende
            </Text>
            <Text fontSize={"md"}>
              {byteSize(project.stats.total_size).toString()}
            </Text>
            <Badge mt={2} variant={"brand"}>
              {project.published ? "Veröffentlicht" : "Privat"}
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
