/**
 * apps/web/src/pages/forum/[username].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import REST from "@codeup/rest";
import {
  FaBirthdayCake,
  FaCheckCircle,
  FaGlobe,
  FaMapMarker,
  FaMapMarkerAlt,
  FaPen,
  FaTrashAlt,
} from "react-icons/fa";
import { useLoggedIn } from "@codeup/hooks";
import { FiMoreHorizontal } from "react-icons/fi";

export default function Profile() {
  const router = useRouter();

  const { loggedIn, loaded, userInfo } = useLoggedIn();

  const {
    isOpen: isDeleteProfileOpen,
    onOpen: onDeleteProfileOpen,
    onClose: onDeleteProfileClose,
  } = useDisclosure();
  const whatEverRef = React.useRef();

  const [profile, setProfile] = useState<{
    _id: string;
    user: string;
    displayName: string;
    verified: boolean;
    bio: string;
    website: string;
    location: string;
    createdAt: string;
    __v: number;
    username: string;
    profilePicture: string;
  } | null>(null);

  useEffect(() => {
    if (router.query.username) {
      REST.Forum.getProfileV2(router.query.username as string).then((res) => {
        if (res.status === 200) {
          setProfile((res.payload as any).profile);
        } else {
          router.push("/404");
        }
      });
    }
  }, [router]);

  return (
    <>
      {!profile ? (
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          w={"100%"}
          h={"100vh"}
        >
          <Spinner size={"xl"} />
        </Flex>
      ) : null}
      {profile ? (
        <>
          <Flex mt={[0, "2rem"]} w={"100%"} justifyContent={"center"}>
            <Box
              w={"100%"}
              maxW={"600px"}
              p={4}
              borderRadius={"md"}
              boxShadow={"md"}
              bg={"gray.700"}
              position={"relative"}
            >
              {loggedIn && userInfo.username === profile.username ? (
                <>
                  <Box
                    position={"absolute"}
                    top={"2rem"}
                    right={"1rem"}
                    zIndex={1}
                  >
                    <Menu>
                      <MenuButton>
                        <IconButton
                          aria-label={"Edit"}
                          icon={<FiMoreHorizontal />}
                          variant={"ghost"}
                          size={"lg"}
                        />
                      </MenuButton>
                      <MenuList>
                        <MenuItem>Bearbeiten</MenuItem>
                        <MenuItem onClick={onDeleteProfileOpen}>
                          Löschen
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                </>
              ) : null}

              <Flex alignItems={"center"}>
                <Avatar
                  src={"/api/account/" + profile.username + "/picture"}
                  size={"xl"}
                />
                <Box ml={4}>
                  <Heading
                    size={"lg"}
                    display={"flex"}
                    alignItems={"center"}
                    gap={"1.2rem"}
                  >
                    {profile.displayName}
                    {profile.verified ? (
                      <>
                        <chakra.span color={"green.500"}>
                          <FaCheckCircle />
                        </chakra.span>
                      </>
                    ) : null}
                  </Heading>
                  <Text color={"gray"}>@{profile.username}</Text>
                </Box>
              </Flex>
              <Box mt={4}>
                <UnorderedList>
                  {profile.website ? (
                    <>
                      <Link
                        href={profile.website}
                        target={"_blank"}
                        mt={"1rem"}
                      >
                        <ListItem
                          display={"flex"}
                          gap={"1.2rem"}
                          alignItems={"center"}
                        >
                          <FaGlobe />
                          Webseite
                        </ListItem>
                      </Link>
                    </>
                  ) : null}
                  {profile.location ? (
                    <>
                      <ListItem
                        display={"flex"}
                        gap={"1.2rem"}
                        mt={"1rem"}
                        alignItems={"center"}
                      >
                        <FaMapMarkerAlt />
                        {profile.location}
                      </ListItem>
                    </>
                  ) : null}

                  <ListItem
                    display={"flex"}
                    gap={"1.2rem"}
                    mt={"1rem"}
                    alignItems={"center"}
                  >
                    <FaBirthdayCake />
                    Mitglied seit:&nbsp;
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </ListItem>
                </UnorderedList>
              </Box>
              <Box mt={4}>
                <Text>{profile.bio}</Text>
              </Box>
            </Box>
          </Flex>
        </>
      ) : null}
      <AlertDialog
        isOpen={isDeleteProfileOpen}
        onClose={onDeleteProfileClose}
        isCentered
        // @ts-ignore
        leastDestructiveRef={whatEverRef}
      >
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)">
          <AlertDialogContent bg={"black"}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Profil löschen
            </AlertDialogHeader>

            <AlertDialogBody>
              Willst du dein Profil wirklich unwiederruflich löschen?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={onDeleteProfileClose}
                // @ts-ignore
                ref={whatEverRef}
              >
                Abbrechen
              </Button>
              <Button
                colorScheme="red"
                variant={"outline"}
                onClick={async () => {
                  if (profile) {
                    await REST.Forum.deleteProfileV2({
                      username: profile.username,
                      token: localStorage.getItem("token") || "",
                    });
                  }

                  onDeleteProfileClose();
                  router.push("/forum");
                }}
                ml={3}
              >
                Löschen
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
