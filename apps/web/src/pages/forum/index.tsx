/**
 * apps/web/src/pages/forum/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.09.2022
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { useEffect } from "react";
import { useRouter } from "next/router";
import REST from "@codeup/rest";
import {
  Flex,
  Spinner,
  Box,
  Heading,
  Avatar,
  Text,
  chakra,
  UnorderedList,
  ListItem,
  Link,
  IconButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  AlertDialog,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftAddon,
  Textarea,
  ButtonGroup,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

export default function Index() {
  const { loggedIn, userInfo, loaded } = useLoggedIn();

  const [hasProfile, setHasProfile] = React.useState(false);

  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      if (!loggedIn) {
        router.push("/");
        window.dispatchEvent(new CustomEvent("codeup::open_login"));
      }
    }
  }, [loaded, loggedIn]);

  useEffect(() => {
    if (userInfo && userInfo.username) {
      REST.Forum.getProfileV2(userInfo.username).then((res) => {
        if (res.status === 200) {
          setHasProfile(true);
        }
      });
    }
  }, [loaded, userInfo]);

  const toast = useToast();

  return (
    <>
      {!hasProfile ? (
        <>
          <Flex w={"100%"} justifyContent={"center"} mt={[0, "2rem"]}>
            <Box
              w={"100%"}
              maxW={"600px"}
              p={4}
              bg={"gray.700"}
              borderRadius={"md"}
              boxShadow={"md"}
            >
              <Heading size={"lg"}>Profil erstellen</Heading>
              <Text mt={4}>
                Du hast noch kein Profil erstellt. Erstelle jetzt dein Profil
                und werde Teil der Community!
              </Text>
              <ButtonGroup w={"100%"} justifyContent={"flex-end"}>
                <Button
                  mt={4}
                  colorScheme={"green"}
                  onClick={async () => {
                    const r = await REST.Forum.createProfileV2({
                      username: userInfo.username,
                      token: localStorage.getItem("token") as string,
                    });

                    if (r.status === 200) {
                      setHasProfile(true);

                      toast({
                        title: "Profil erstellt",
                        description: "Dein Profil wurde erfolgreich erstellt!",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                        status: "success",
                      });
                    } else {
                      toast({
                        title: "Fehler",
                        description:
                          "Dein Profil konnte nicht erstellt werden!",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                        status: "error",
                      });
                    }
                  }}
                >
                  Profil erstellen
                </Button>
              </ButtonGroup>
            </Box>
          </Flex>
        </>
      ) : null}
    </>
  );
}
