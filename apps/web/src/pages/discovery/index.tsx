/**
 * apps/web/src/pages/discovery/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.12.2022
 *
 */

import * as React from "react";
import REST from "@codeup/rest/src";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import {
  Grid,
  GridItem,
  Heading,
  Button,
  Text,
  chakra,
  Flex,
  Image,
  Box,
} from "@chakra-ui/react";
import { Card, CardBody, CardHeader, CardFooter } from "@chakra-ui/card";

export default function Discovery() {
  const [projects, setProjects] = React.useState<
    {
      name: string;
      description: string;
      author: string;
      customName: string;
    }[]
  >([]);

  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    REST.Discovery.getDiscoveryProjects().then((res) => {
      if (res.status === 200) {
        setProjects(res.payload.projects);
      } else {
        setError(true);
      }
    });
  }, []);

  return (
    <>
      {error ? (
        <>
          <ErrorComponent
            description={"Ein Fehler ist aufgetreten!"}
            title={"Fehler"}
          />
        </>
      ) : (
        <>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(4, 1fr)",
            ]}
            gap={6}
            p={12}
          >
            {projects.map((project, index) => {
              return (
                <>
                  <GridItem key={index}>
                    <Box
                      bg={"gray.900"}
                      color={"white"}
                      rounded={"lg"}
                      p={6}
                      h={"100%"}
                      cursor={"pointer"}
                      _hover={{
                        shadow: "2xl",
                      }}
                      onClick={() => {
                        window.open("/project/" + project.customName, "_blank");
                      }}
                    >
                      <Flex
                        justifyContent={"space-between"}
                        direction={"column"}
                        gap={2}
                      >
                        <Heading
                          size={"xl"}
                          color={"white"}
                          fontWeight={"bold"}
                          textAlign={"left"}
                          mt={4}
                        >
                          {project.name}
                        </Heading>
                        <Text
                          fontSize={"xl"}
                          color={"gray.400"}
                          textAlign={"left"}
                        >
                          von&nbsp;
                          <chakra.span color={"green.400"}>
                            @{project.author}
                          </chakra.span>
                        </Text>
                        <Heading
                          size={"lg"}
                          color={"gray.400"}
                          fontWeight={"normal"}
                          textAlign={"left"}
                        >
                          {project.description}
                        </Heading>
                      </Flex>
                    </Box>
                  </GridItem>
                </>
              );
            })}
          </Grid>
        </>
      )}
    </>
  );
}
