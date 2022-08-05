/**
 * apps/web/src/pages/todo/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.07.2022
 *
 */

import * as React from "react";
import { useEffect } from "react";
import redirect from "@codeup/util/src/userworkflow/redirect";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import REST from "@codeup/rest";
import ListViewer from "@codeup/components/todo/ListViewer";

export default function Index() {
  const router = useRouter();
  const toast = useToast();

  const [lists, setLists] = React.useState<
    {
      _id: string;
      name: string;
      tasks: {
        name: string;
        finished: boolean;
        uuid: string;
      }[];
    }[]
  >([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    redirect({
      allowAnonymous: false,
      redirectTo: router.pathname,
      redirectToLogin: true,
      forceAnonymous: false,
    });
  }, [router]);

  useEffect(() => {
    reloadLists();
  }, []);

  async function reloadLists() {
    const res = await REST.ToDo.getMyLists(
      localStorage.getItem("token") as string
    );

    if (res.status === 200) {
      setLists(res.payload.lists);
    } else {
      toast({
        position: "top",
        variant: "solid",
        status: "error",
        title: "Fehler",
        description: res.payload.error,
        isClosable: true,
        duration: 6000,
      });
    }
  }

  const [currentList, setCurrentList] = React.useState<{
    _id: string;
    name: string;
    tasks: {
      name: string;
      finished: boolean;
      uuid: string;
    }[];
  } | null>(null);

  return (
    <>
      <Heading size={"xl"} textAlign={"center"} mt={"2rem"}>
        ToDo
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
                Neue Liste
              </Heading>
            </Box>
          </PopoverTrigger>
          <PopoverContent bgColor={"black"}>
            <PopoverArrow bgColor={"black"} />
            <PopoverCloseButton />
            <PopoverHeader>Neue Liste</PopoverHeader>
            <PopoverBody>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const res = await REST.ToDo.createList({
                    token: localStorage.getItem("token") as string,
                    // @ts-ignore
                    name: e.target.elements.name.value,
                  });
                  if (res.status === 200) {
                    // @ts-ignore
                    e.target.elements.name.value = "";
                    reloadLists();
                    toast({
                      position: "top",
                      variant: "solid",
                      status: "success",
                      title: "Erfolgreich",
                      description: "Die Liste wurde erstellt",
                      isClosable: true,
                      duration: 6000,
                    });
                  } else {
                    toast({
                      position: "top",
                      variant: "solid",
                      status: "error",
                      title: "Fehler",
                      description: res.payload.error,
                      isClosable: true,
                      duration: 6000,
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
        {lists.map((list) => {
          return (
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
              _hover={{
                shadow: "2xl",
              }}
              onClick={() => {
                setCurrentList(list);
                onOpen();
              }}
            >
              <Heading size={"md"} textAlign={"center"}>
                {list.name}
              </Heading>
              <Text textAlign={"center"} color={"gray.600"}>
                {list.tasks.length} Aufgaben
              </Text>
            </Box>
          );
        })}
      </SimpleGrid>
      <ListViewer
        isOpen={isOpen}
        onClose={onClose}
        currentList={currentList}
        setCurrentList={setCurrentList}
        reloadLists={reloadLists}
      />
    </>
  );
}
