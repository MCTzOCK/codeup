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
  Grid,
  GridItem,
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
  FaCrown,
  FaEnvelope,
  FaFile,
  FaGlobe,
  FaImage,
  FaMapMarkerAlt,
  FaTimesCircle,
  FaVideo,
} from "react-icons/fa";
import { useLoggedIn } from "@codeup/hooks";
import { FiMoreHorizontal } from "react-icons/fi";
import PostCardV2 from "@codeup/components/forum/PostCardV2";
import Head from "next/head";
import PopupManager from "../../global/PopupManager";
import AccountManager from "@codeup/util/dist/AccountManager";

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
    certificates: {
      _id: string;
      course: {
        _id: string;
        name: string;
        friendlyName: string;
        splashImage: string;
      };
      percentage: number;
      date: string;
    }[];
  } | null>(null);

  const [certificates, setCertificates] = useState<
    {
      _id: string;
      percentage: number;
      date: string;
      course: {
        _id: string;
        name: string;
        friendlyName: string;
        splashImage: string;
      };
    }[]
  >([]);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [posts, setPosts] = useState<any[]>([]);

  const toast = useToast();

  const reloadProfile = () => {
    REST.Forum.getProfileV2(router.query.username as string).then(
      async (res) => {
        if (res.status === 200) {
          const certificates: any[] = [];

          for (const certificate of (res.payload as any).profile.certificates) {
            const r = await REST.Certificates.getObtainedCertificate(
              certificate
            );

            if (r.status === 200) {
              let x = r.payload;
              certificates.push({
                _id: x.obtainedCertificate._id,
                percentage: x.obtainedCertificate.percentage,
                date: x.obtainedCertificate.date,
                course: {
                  _id: x.course._id,
                  name: x.course.name,
                  friendlyName: x.course.friendlyName,
                  splashImage: x.course.splashImage,
                },
              });
            }
          }

          let pf = {
            ...(res.payload as any).profile,
            certificates,
          };

          setProfile(pf);
        } else {
          router.push("/404");
        }
      }
    );

    REST.Certificates.getObtainedCertificates(
      AccountManager.getActiveToken()
    ).then((res) => {
      if (res.status === 200) {
        setCertificates(
          res.payload.certs.map((c: any) => {
            return {
              ...c,
              course: c.courseObj,
            };
          })
        );
      }
    });
  };

  useEffect(() => {
    if (router.query.username) {
      reloadProfile();
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
          <Flex p={4} w={"100%"} justifyContent={"center"}>
            <Box
              w={"100%"}
              maxW={"600px"}
              p={4}
              borderRadius={"md"}
              boxShadow={"md"}
              bg={"black"}
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
                  {editMode && userInfo.subscription !== "PRO" ? (
                    <>
                      <HStack color={"orange.400"}>
                        <FaCrown />
                        <Text>
                          Personalisiere dein Profil mit <b>CodeUp PRO</b>
                        </Text>
                      </HStack>
                    </>
                  ) : null}
                  {editMode ? (
                    <>
                      <Input
                        type={"text"}
                        id={"edit-display_name"}
                        placeholder={"Anzeigename"}
                        defaultValue={profile.displayName}
                        onChange={(e) => {}}
                        disabled={userInfo.subscription !== "PRO"}
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
                            <chakra.span color={"brand.500"}>
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
                          disabled={userInfo.subscription !== "PRO"}
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
                          disabled={userInfo.subscription !== "PRO"}
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
                    <Textarea
                      disabled={userInfo.subscription !== "PRO"}
                      defaultValue={profile.bio}
                      id={"edit-bio"}
                    />
                  </>
                ) : (
                  <Text>{profile.bio}</Text>
                )}
              </Box>
              <Box mt={4}>
                {editMode ? (
                  <>
                    <Grid
                      templateColumns={[
                        "repeat(1, 1fr)",
                        "repeat(2, 1fr)",
                        "repeat(3, 1fr)",
                      ]}
                      gap={6}
                      mt={"2rem"}
                    >
                      {certificates.map((cert) => (
                        <>
                          <GridItem>
                            <Stack
                              alignItems={"center"}
                              cursor={"pointer"}
                              onClick={async () => {
                                let newCerts: typeof profile.certificates =
                                  profile.certificates;

                                if (newCerts.find((c) => c._id === cert._id)) {
                                  newCerts = newCerts.filter(
                                    (c) => c._id !== cert._id
                                  );
                                } else {
                                  newCerts.push({
                                    _id: cert._id,
                                    course: cert.course,
                                    percentage: cert.percentage,
                                    date: cert.date,
                                  });
                                }

                                const res = await REST.Forum.modifyProfileV2({
                                  token: AccountManager.getActiveToken(),
                                  update: {
                                    certificates: newCerts.map(
                                      (c: any) => c._id
                                    ),
                                  },
                                  username: profile.username,
                                });
                                if (res.status === 200) {
                                  reloadProfile();
                                  toast({
                                    title: "Erfolgreich",
                                    position: "top-right",
                                    description:
                                      "Deine Änderungen wurden gespeichert",
                                    status: "success",
                                    duration: 1500,
                                    variant: "solid",
                                  });
                                } else {
                                  toast({
                                    title: "Fehler",
                                    position: "top-right",
                                    description:
                                      "Deine Änderungen konnten nicht gespeichert werden",
                                    status: "error",
                                    duration: 1500,
                                    variant: "solid",
                                  });
                                }
                              }}
                            >
                              <Image
                                src={cert.course.splashImage}
                                w={32}
                                h={32}
                                alt={cert.course.name}
                              />
                              <Text>{cert.course.name}</Text>
                              <Text>
                                Aktuell angezeigt:&nbsp;
                                {profile.certificates.find(
                                  (c) => c._id === cert._id
                                )
                                  ? "Ja"
                                  : "Nein"}
                              </Text>
                            </Stack>
                          </GridItem>
                        </>
                      ))}
                    </Grid>
                  </>
                ) : (
                  <>
                    <Heading size={"md"}>Zertifikate</Heading>
                    <Grid
                      templateColumns={[
                        "repeat(1, 1fr)",
                        "repeat(2, 1fr)",
                        "repeat(3, 1fr)",
                      ]}
                      gap={6}
                      mt={"2rem"}
                    >
                      {profile.certificates.map((cert) => {
                        console.log(cert);
                        return (
                          <>
                            <GridItem>
                              <Stack
                                alignItems={"center"}
                                cursor={"pointer"}
                                onClick={() => {
                                  router.push("/user-cert/" + cert._id);
                                }}
                              >
                                <Image
                                  src={cert.course.splashImage}
                                  w={32}
                                  h={32}
                                  alt={cert.course.name}
                                />
                              </Stack>
                            </GridItem>
                          </>
                        );
                      })}
                    </Grid>
                  </>
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
                      variant={"brand"}
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
                          reloadProfile();
                          setSaving(false);
                          setEditMode(false);
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
                              <Button variant={"brand"}>Beitrag</Button>
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
                                  variant={"brand"}
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
                            <MenuButton as={Button} variant={"brand"}>
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
