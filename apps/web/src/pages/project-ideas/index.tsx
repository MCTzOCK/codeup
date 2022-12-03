/**
 * apps/web/src/pages/project-ideas/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.12.2022
 *
 */

import * as React from "react";
import { useEffect } from "react";
import { useLoggedIn } from "@codeup/hooks";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import REST from "@codeup/rest";
import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { Card, CardBody, CardFooter } from "@chakra-ui/card";
import { useRouter } from "next/router";

export default function Viewer() {
  const [projectIdeas, setProjectIdeas] = React.useState<
    {
      _id: string;
      title: string;
      description: string;
      exampleDeployedURL?: string;
      exampleSourceURL?: string;
    }[]
  >([]);

  const [filteredProjectIdeas, setFilteredProjectIdeas] = React.useState<
    {
      _id: string;
      title: string;
      description: string;
      exampleDeployedURL?: string;
      exampleSourceURL?: string;
    }[]
  >([]);

  const toast = useToast();
  const router = useRouter();

  const reload = () => {
    REST.Ideas.getProjectIdeas().then((res) => {
      if (res.status === 200) {
        setProjectIdeas(res.payload.ideas);
        setFilteredProjectIdeas(res.payload.ideas);
      } else {
        toast({
          title: "Fehler",
          description: "Ein Fehler ist aufgetreten: " + res.payload.error,
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "bottom-right",
        });
      }
    });
  };

  useEffect(() => {
    reload();
  }, []);

  const [query, setQuery] = React.useState<string>("");

  useEffect(() => {
    setFilteredProjectIdeas(
      projectIdeas.filter((idea) =>
        idea.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query]);

  return (
    <>
      <Flex
        w={"100%"}
        mt={"2rem"}
        alignItems={"center"}
        justifyContent={"center"}
        direction={"column"}
      >
        <Heading size={"2xl"} textAlign={"center"} mt={"2rem"}>
          Projektideen
        </Heading>
        <Input
          placeholder={"Suche nach Projektideen"}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          w={"50%"}
          mt={"2rem"}
        />
      </Flex>
      <Grid
        templateColumns={
          filteredProjectIdeas.length > 0
            ? [
                "repeat(1, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
                "repeat(4, 1fr)",
                "repeat(5, 1fr)",
              ]
            : "repeat(1, 1fr)"
        }
        gap={6}
        p={10}
      >
        {filteredProjectIdeas.map((idea) => (
          <>
            <Card
              maxW="sm"
              h={"100%"}
              bgColor={"black"}
              rounded={"xl"}
              boxShadow={"xl"}
              p={5}
              id={"_card_" + idea._id}
            >
              <CardBody>
                <Stack mt={2} spacing="3">
                  <Heading size="md">{idea.title}</Heading>
                  <Text>{idea.description}</Text>
                </Stack>
              </CardBody>
              <CardFooter mt={4}>
                <ButtonGroup spacing="2">
                  {idea.exampleDeployedURL && idea.exampleDeployedURL !== "" ? (
                    <>
                      <Button
                        colorScheme="blue"
                        variant={"solid"}
                        onClick={() => {
                          window.open(idea.exampleDeployedURL, "_blank");
                        }}
                      >
                        Beispiel
                      </Button>
                    </>
                  ) : null}
                  {idea.exampleSourceURL && idea.exampleSourceURL !== "" ? (
                    <>
                      <Button
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => {
                          window.open(idea.exampleSourceURL, "_blank");
                        }}
                      >
                        Source Code
                      </Button>
                    </>
                  ) : null}
                </ButtonGroup>
              </CardFooter>
            </Card>
          </>
        ))}
        {filteredProjectIdeas.length === 0 ? (
          <>
            <Text
              textAlign={"center"}
              fontSize={"2xl"}
              color={"gray.500"}
              mt={4}
            >
              Keine Projekt Ideen gefunden!
            </Text>
          </>
        ) : null}
      </Grid>
    </>
  );
}
