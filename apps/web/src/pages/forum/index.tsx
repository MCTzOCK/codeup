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
import { useEffect } from "react";
import { useLoggedIn } from "@codeup/hooks";
import { useRouter } from "next/router";
import REST from "@codeup/rest";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import DeferredPostCardV2 from "@codeup/components/forum/DeferredPostCardV2";
import Head from "next/head";

export default function Index() {
  const { loggedIn, userInfo, loaded } = useLoggedIn();

  const [hasProfile, setHasProfile] = React.useState(false);
  const [profiles, setProfiles] = React.useState<
    {
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
    }[]
  >([]);

  const [posts, setPosts] = React.useState<any[]>([]);

  const [profileQuery, setProfileQuery] = React.useState("");
  const [postQuery, setPostQuery] = React.useState<string>("");

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

  useEffect(() => {
    if (hasProfile) {
      REST.Forum.getProfilesV2().then((res) => {
        if (res.status === 200) {
          setProfiles(res.payload.profiles);
        }
      });
      REST.Forum.getAllPostsV2().then((res) => {
        if (res.status === 200) {
          setPosts(res.payload.posts);
        }
      });
    }
  }, [hasProfile]);

  const toast = useToast();

  return (
    <>
      <Head>
        <title>Forum - CodeUp</title>
      </Head>
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
      ) : (
        <>
          <Flex
            w={"100%"}
            direction={["column", "row"]}
            gap={"2rem"}
            mb={"2rem"}
          >
            <Flex flex={"100%"} justifyContent={"center"} mt={[0, "2rem"]}>
              <Box
                w={"100%"}
                maxW={"600px"}
                p={4}
                bg={"gray.700"}
                borderRadius={"md"}
                boxShadow={"md"}
              >
                <Heading size={"lg"}>Öffentliche Profile</Heading>
                <Text mt={4}>
                  Hier findest du alle öffentlichen Profile der Community.
                </Text>
                <Input
                  mt={4}
                  placeholder={"Profil suchen..."}
                  onChange={(e) => {
                    setProfileQuery(e.target.value);
                  }}
                />
                <Flex
                  w={"100%"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  {profiles.map((profile) => (
                    <>
                      {profile.displayName
                        .toLowerCase()
                        .includes(profileQuery.toLowerCase()) ||
                      profile.username
                        .toLowerCase()
                        .includes(profileQuery.toLowerCase()) ? (
                        <>
                          <Flex
                            w={"100%"}
                            p={4}
                            bg={"gray.600"}
                            borderRadius={"md"}
                            mt={4}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            _hover={{
                              bg: "gray.500",
                            }}
                            cursor={"pointer"}
                            onClick={() => {
                              router.push(`/forum/${profile.username}`);
                            }}
                          >
                            <Flex direction={"row"}>
                              <Avatar
                                size={"lg"}
                                src={
                                  "/api/account/" +
                                  profile.username +
                                  "/picture"
                                }
                              />
                              <Flex flexDirection={"column"} ml={4}>
                                <Heading
                                  size={"md"}
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
                                <Text>{profile.bio}</Text>
                              </Flex>
                            </Flex>
                          </Flex>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  ))}
                </Flex>
              </Box>
            </Flex>
            <Flex flex={"100%"} justifyContent={"center"} mt={[0, "2rem"]}>
              <Box
                w={"100%"}
                maxW={"600px"}
                p={4}
                bg={"gray.700"}
                borderRadius={"md"}
                boxShadow={"md"}
              >
                <Heading size={"lg"}>Beiträge</Heading>
                <Text mt={4}>Hier findest du alle Beiträge.</Text>
                <Input
                  mt={4}
                  placeholder={"Beiträge suchen..."}
                  onChange={(e) => {
                    setPostQuery(e.target.value);
                  }}
                />
                <Flex w={"100%"} flexDirection={"column"}>
                  {posts.map((post) => {
                    return (
                      <>
                        {post.content
                          .toLowerCase()
                          .includes(postQuery.toLowerCase()) ? (
                          <DeferredPostCardV2
                            post={post}
                            debug={true}
                            reloadPosts={() => {}}
                          />
                        ) : null}
                      </>
                    );
                  })}
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
}
