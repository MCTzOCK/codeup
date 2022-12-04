/**
 * apps/web/src/pages/planning/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.12.2022
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { useEffect } from "react";
import { useRouter } from "next/router";
import REST from "@codeup/rest";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";

export default function Index() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();
  const router = useRouter();

  const [projects, setProjects] = React.useState<any[]>([]);

  useEffect(() => {
    if (!loggedIn && loaded) {
      router.push("/");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    } else if (loaded && loggedIn) {
      reload();
    }
  }, [userInfo, loggedIn, loaded]);

  const toast = useToast();

  const reload = () => {
    REST.ToDo.getV2Projects(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setProjects(res.payload.projects);
        } else {
          toast({
            title: "Fehler",
            description:
              "Beim Laden der Projekte ist ein Fehler aufgetreten: " +
              res.payload.error,
            status: "error",
            duration: 1500,
            isClosable: true,
            position: "bottom-right",
          });
        }
      }
    );
  };

  return (
    <>
      <Heading size="2xl" textAlign={"center"} mt={"2rem"}>
        Projekte
      </Heading>
      <SimpleGrid minChildWidth={300} p={"2rem"}>
        <Popover>
          <PopoverTrigger>
            <Box
              p={"2rem"}
              rounded={"xl"}
              borderWidth={"2px"}
              borderStyle={"dashed"}
              borderColor={"gray.600"}
              maxW={300}
              cursor={"pointer"}
              transition={"all 120ms ease"}
              mt={"1.2rem"}
              _hover={{
                shadow: "2xl",
              }}
            >
              <Heading size={"md"} textAlign={"center"}>
                Neues Projekt
              </Heading>
            </Box>
          </PopoverTrigger>
          <PopoverContent bgColor={"black"}>
            <PopoverArrow bgColor={"black"} />
            <PopoverCloseButton />
            <PopoverHeader>Neues Projekt</PopoverHeader>
            <PopoverBody>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const res = await REST.ToDo.createV2Project({
                    token: localStorage.getItem("token") as string,
                    // @ts-ignore
                    name: e.target.elements.name.value,
                  });
                  if (res.status === 200) {
                    // @ts-ignore
                    e.target.elements.name.value = "";
                    reload();
                    toast({
                      position: "bottom-right",
                      status: "success",
                      title: "Erfolgreich",
                      description: "Das Projekt wurde erstellt",
                      isClosable: true,
                      duration: 1500,
                    });
                  } else {
                    toast({
                      position: "bottom-right",
                      status: "error",
                      title: "Fehler",
                      description: res.payload.error,
                      isClosable: true,
                      duration: 1500,
                    });
                  }
                }}
              >
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name={"name"}
                    id={"name"}
                    type={"text"}
                    placeholder={"Name"}
                  />
                </FormControl>
                <Button type={"submit"} mt={"1.2rem"}>
                  Erstellen
                </Button>
              </form>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {projects.map((p: any) => {
          return (
            <>
              <Box
                p={"2rem"}
                rounded={"xl"}
                borderWidth={"2px"}
                borderStyle={"solid"}
                borderColor={"gray.600"}
                maxW={300}
                cursor={"pointer"}
                position={"relative"}
                transition={"all 120ms ease"}
                mt={"1.2rem"}
                zIndex={1}
              >
                <Heading size={"md"} textAlign={"center"}>
                  {p.name}
                </Heading>
                <ButtonGroup w={"100%"} mt={"1.2rem"}>
                  <Button
                    w={"100%"}
                    colorScheme={"blue"}
                    onClick={() => {
                      router.push("/planning/" + p._id);
                    }}
                  >
                    Öffnen
                  </Button>
                  <Button
                    w={"100%"}
                    colorScheme={"red"}
                    variant={"ghost"}
                    onClick={() => {
                      REST.ToDo.deleteV2Project({
                        token: localStorage.getItem("token") as string,
                        id: p._id,
                      }).then((res) => {
                        if (res.status === 200) {
                          toast({
                            position: "bottom-right",
                            status: "success",
                            title: "Erfolgreich",
                            description: "Das Projekt wurde gelöscht",
                            isClosable: true,
                            duration: 1500,
                          });
                          reload();
                        } else {
                          toast({
                            position: "bottom-right",
                            status: "error",
                            title: "Fehler",
                            description: res.payload.error,
                            isClosable: true,
                            duration: 1500,
                          });
                        }
                      });
                    }}
                  >
                    Löschen
                  </Button>
                </ButtonGroup>
              </Box>
            </>
          );
        })}
      </SimpleGrid>
    </>
  );
}
