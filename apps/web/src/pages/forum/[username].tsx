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
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  chakra,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
  Textarea,
  Tooltip,
  UnorderedList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import REST from "@codeup/rest";
import {
  FaBirthdayCake,
  FaCheckCircle,
  FaEnvelope,
  FaFile,
  FaGlobe,
  FaImage,
  FaMapMarkerAlt,
  FaVideo,
} from "react-icons/fa";
import { useLoggedIn } from "@codeup/hooks";
import { FiMoreHorizontal } from "react-icons/fi";
import PostCardV2 from "@codeup/components/forum/PostCardV2";
import Head from "next/head";
import PopupManager from "../../global/PopupManager";

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

  const [editMode, setEditMode] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [posts, setPosts] = useState<any[]>([]);

  const toast = useToast();

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

  const reloadPosts = () => {
    if (profile && profile.username) {
      REST.Forum.getProfilePostsV2({
        username: profile.username,
      }).then((res) => {
        if (res.status === 200) {
          setPosts(res.payload.posts);
        } else {
          toast({
            title: "Fehler",
            description: "Beim Laden der Beiträge ist ein Fehler aufgetreten.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      });
    }
  };

  useEffect(reloadPosts, [profile]);

  function upload(options: {
    prefix: string;
    mimeType: string;
    fileNameAsSuffix: boolean;
  }) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/media/upload";
    const a = document.createElement("input");
    a.type = "file";
    a.accept = options.mimeType;
    a.name = "file";

    form.appendChild(a);

    a.click();

    a.onchange = async () => {
      const formData = new FormData(form);
      const r = await fetch("/media/upload", {
        method: "POST",
        body: formData,
      });

      if (r.status === 200) {
        const json = await r.json();

        const url = await json.data.url;

        const r0 = await REST.Forum.createPostV2({
          token: localStorage.getItem("token") as string,
          content: location.origin + url,
        });

        if (r0.status === 200) {
          reloadPosts();
        } else {
          toast({
            title: "Fehler",
            description: "Beim Hochladen ist ein Fehler aufgetreten.",
            status: "error",
            duration: 1500,
            isClosable: true,
            position: "top",
          });
        }
      } else {
        toast({
          title: "Fehler",
          description: "Beim Hochladen ist ein Fehler aufgetreten.",
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "top",
        });
      }
    };
  }

  return (
    <>
      <Head>
        <title>@{router.query.username || "user"} - CodeUp</title>
      </Head>
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
          <Flex
            mt={[0, "2rem"]}
            mb={[0, "2rem"]}
            w={"100%"}
            justifyContent={"center"}
          >
            <Box
              w={"100%"}
              maxW={"600px"}
              p={4}
              borderRadius={"md"}
              boxShadow={"md"}
              bg={"gray.700"}
              position={"relative"}
            >
              {userInfo.username !== profile.username ? (
                <>
                  <Box
                    position={"absolute"}
                    top={"2rem"}
                    right={"1rem"}
                    zIndex={editMode ? -1 : 1}
                  >
                    <IconButton
                      aria-label={"Nachricht schreiben"}
                      icon={<FaEnvelope />}
                      onClick={async () => {
                        const r = await REST.Forum.createChatV2({
                          user: profile.username,
                          token: localStorage.getItem("token") as string,
                        });

                        if (r.status === 200) {
                          router.push(
                            "/forum/messages?chat=" + r.payload.chat._id
                          );
                        } else {
                          toast({
                            title: "Fehler",
                            description:
                              "Beim Erstellen des Chats ist ein Fehler aufgetreten.",
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                          });
                        }
                      }}
                    />
                  </Box>
                </>
              ) : null}
              {loggedIn && userInfo.username === profile.username ? (
                <>
                  <Box
                    position={"absolute"}
                    top={"2rem"}
                    right={"1rem"}
                    zIndex={editMode ? -1 : 1}
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
                        <MenuItem
                          onClick={() => {
                            setEditMode(true);
                          }}
                        >
                          Bearbeiten
                        </MenuItem>
                        <MenuItem
                          onClick={async () => {
                            if (
                              await PopupManager.confirmAsync({
                                title: "Profil löschen",
                                question:
                                  "Bist du dir sicher, dass du dein Profil löschen möchtest? Dies kann nicht rückgängig gemacht werden.",
                              })
                            )
                              if (profile) {
                                await REST.Forum.deleteProfileV2({
                                  username: profile.username,
                                  token: localStorage.getItem("token") || "",
                                });
                              }

                            onDeleteProfileClose();
                            router.push("/forum");
                          }}
                        >
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
                  {editMode ? (
                    <>
                      <Input
                        type={"text"}
                        id={"edit-display_name"}
                        placeholder={"Anzeigename"}
                        defaultValue={profile.displayName}
                        onChange={(e) => {}}
                      />
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                  <Text color={"gray"}>@{profile.username}</Text>
                </Box>
              </Flex>
              <Box mt={4}>
                {!editMode ? (
                  <>
                    <HStack>
                      {
                        // @ts-ignore
                        profile.badges.map((b: string) => (
                          <>
                            <Tooltip label={"Der Benuter ist ein " + b}>
                              <Image
                                src={
                                  "/_static/vectors/forum/badges/" + b + ".svg"
                                }
                                alt={b}
                                w={8}
                                h={8}
                              />
                            </Tooltip>
                          </>
                        ))
                      }
                    </HStack>
                  </>
                ) : null}
              </Box>
              <Box mt={4}>
                <UnorderedList>
                  {editMode ? (
                    <>
                      <InputGroup mt={4}>
                        <InputLeftAddon>
                          <FaGlobe />
                        </InputLeftAddon>
                        <Input
                          type={"text"}
                          id={"edit-website"}
                          placeholder={"Webseite"}
                          defaultValue={profile.website}
                        />
                      </InputGroup>
                    </>
                  ) : null}
                  {profile.website && !editMode ? (
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
                  {editMode ? (
                    <>
                      <InputGroup mt={4}>
                        <InputLeftAddon>
                          <FaMapMarkerAlt />
                        </InputLeftAddon>
                        <Input
                          type={"text"}
                          id={"edit-location"}
                          placeholder={"Ort"}
                          defaultValue={profile.location}
                        />
                      </InputGroup>
                    </>
                  ) : null}
                  {profile.location && !editMode ? (
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
                {editMode ? (
                  <>
                    <Textarea defaultValue={profile.bio} id={"edit-bio"} />
                  </>
                ) : (
                  <Text>{profile.bio}</Text>
                )}
              </Box>
              {editMode ? (
                <Box mt={4}>
                  <ButtonGroup w={"100%"} justifyContent={"flex-end"}>
                    <Button
                      colorScheme={"gray"}
                      onClick={() => {
                        setEditMode(false);
                      }}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      colorScheme={"green"}
                      isLoading={saving}
                      onClick={async () => {
                        setSaving(true);

                        const displayName = document.getElementById(
                          "edit-display_name"
                        ) as HTMLInputElement;

                        const website = document.getElementById(
                          "edit-website"
                        ) as HTMLInputElement;

                        const location = document.getElementById(
                          "edit-location"
                        ) as HTMLInputElement;

                        const bio = document.getElementById(
                          "edit-bio"
                        ) as HTMLInputElement;

                        const data = {
                          displayName:
                            displayName.value === ""
                              ? "CodeUp Benutzer"
                              : displayName.value,
                          website:
                            website.value === ""
                              ? "https://codeup.space"
                              : website.value,
                          location:
                            location.value === "" ? "CodeUp" : location.value,
                          bio: bio.value === "" ? "CodeUp Benutzer" : bio.value,
                        };

                        const r = await REST.Forum.modifyProfileV2({
                          token: localStorage.getItem("token") as string,
                          username: profile.username,
                          update: {
                            displayName:
                              data.displayName !== profile.displayName
                                ? data.displayName
                                : undefined,
                            website:
                              data.website !== profile.website
                                ? data.website
                                : undefined,
                            location:
                              data.location !== profile.location
                                ? data.location
                                : undefined,
                            bio:
                              data.bio !== profile.bio ? data.bio : undefined,
                          },
                        });

                        if (r.status === 200) {
                          const p = await REST.Forum.getProfileV2(
                            profile.username
                          );

                          if (p.status === 200) {
                            setProfile(p.payload.profile);
                            setSaving(false);
                            setEditMode(false);
                          } else {
                            toast({
                              title: "Fehler",
                              description: p.payload.message,
                              status: "error",
                              duration: 5000,
                              isClosable: true,
                              position: "top",
                            });
                          }
                        } else {
                          toast({
                            title: "Fehler",
                            description: r.payload.message,
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                            position: "top",
                          });
                        }
                      }}
                    >
                      Speichern
                    </Button>
                  </ButtonGroup>
                </Box>
              ) : null}
              <Box mt={8}>
                <Flex w={"100%"} alignItems={"center"}>
                  <Heading size={"lg"} flex={"100%"}>
                    Beiträge
                  </Heading>
                  {profile.username === userInfo.username ? (
                    <>
                      <Box flex={"100%"} textAlign={"right"}>
                        <Stack>
                          <Popover>
                            <PopoverTrigger>
                              <Button colorScheme={"green"}>Beitrag</Button>
                            </PopoverTrigger>
                            <PopoverContent bg={"black"} textAlign={"left"}>
                              <PopoverArrow bg={"black"} />
                              <PopoverHeader>Neuer Beitrag</PopoverHeader>
                              <PopoverBody>
                                <Textarea
                                  id={"new-post_text"}
                                  placeholder={"Inhalt"}
                                />
                              </PopoverBody>
                              <PopoverFooter>
                                <Button
                                  colorScheme={"green"}
                                  onClick={async () => {
                                    const content = document.getElementById(
                                      "new-post_text"
                                    ) as HTMLInputElement;

                                    const r = await REST.Forum.createPostV2({
                                      token: localStorage.getItem(
                                        "token"
                                      ) as string,
                                      content: content.value,
                                    });

                                    if (r.status === 200) {
                                      reloadPosts();
                                      content.value = "";
                                    } else {
                                      toast({
                                        title: "Fehler",
                                        description:
                                          "Der Beitrag konnte nicht veröffentlicht werden",
                                        status: "error",
                                        duration: 5000,
                                        isClosable: true,
                                        position: "top",
                                      });
                                    }
                                  }}
                                >
                                  Veröffentlichen
                                </Button>
                              </PopoverFooter>
                            </PopoverContent>
                          </Popover>
                          <Menu>
                            <MenuButton as={Button} colorScheme={"blue"}>
                              Medium
                            </MenuButton>
                            <MenuList>
                              <MenuItem
                                icon={<FaImage />}
                                onClick={async () => {
                                  upload({
                                    fileNameAsSuffix: false,
                                    mimeType: "image/*",
                                    prefix: "image",
                                  });
                                }}
                              >
                                Bild
                              </MenuItem>
                              <MenuItem
                                icon={<FaVideo />}
                                onClick={async () => {
                                  upload({
                                    fileNameAsSuffix: false,
                                    mimeType: "video/*",
                                    prefix: "video",
                                  });
                                }}
                              >
                                Video
                              </MenuItem>
                              <MenuItem
                                icon={<FaFile />}
                                onClick={async () => {
                                  upload({
                                    fileNameAsSuffix: true,
                                    mimeType: "*",
                                    prefix: "file",
                                  });
                                }}
                              >
                                Datei
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Stack>
                      </Box>
                    </>
                  ) : null}
                </Flex>
                <Box mt={4}>
                  {posts.length === 0 ? (
                    <Text>Keine Beiträge vorhanden</Text>
                  ) : (
                    <>
                      {posts.map((post) => {
                        return (
                          <>
                            <PostCardV2
                              post={post}
                              profile={profile}
                              postOwner={userInfo.username === profile.username}
                              reloadPosts={reloadPosts}
                              userId={userInfo.id}
                            />
                            <Divider />
                          </>
                        );
                      })}
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Flex>
        </>
      ) : null}
    </>
  );
}
