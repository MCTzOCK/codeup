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
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function Index() {
  const { loggedIn, userInfo, loaded } = useLoggedIn();

  const { t } = useTranslation("forum");

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
        <title>{t("doc.title")}</title>
      </Head>
      {!hasProfile ? (
        <>
          <Flex w={"100%"} justifyContent={"center"} p={4}>
            <Box
              w={"100%"}
              maxW={"600px"}
              p={4}
              bg={"black"}
              borderRadius={"md"}
              boxShadow={"md"}
            >
              <CHeading size={"lg"}>{t("profile.create.title")}</CHeading>
              <Text mt={4}>{t("profile.create.text")}</Text>
              <ButtonGroup w={"100%"} justifyContent={"flex-end"}>
                <Button
                  mt={4}
                  variant={"brand"}
                  onClick={async () => {
                    const r = await REST.Forum.createProfileV2({
                      username: userInfo.username,
                      token: localStorage.getItem("token") as string,
                    });

                    if (r.status === 200) {
                      setHasProfile(true);

                      toast({
                        title: t("profile.created"),
                        description: t("profile.created.text"),
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                        status: "success",
                      });
                    } else {
                      toast({
                        title: t("base:control.error"),
                        description: t("profile.created.error"),
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                        status: "error",
                      });
                    }
                  }}
                >
                  {t("profile.create.title")}
                </Button>
              </ButtonGroup>
            </Box>
          </Flex>
        </>
      ) : (
        <>
          <Flex
            w={"100%"}
            direction={{
              base: "column",
              lg: "row",
            }}
            gap={"2rem"}
            p={4}
          >
            <Flex flex={"100%"} justifyContent={"center"} mt={[0, "2rem"]}>
              <Box
                w={"100%"}
                maxW={"600px"}
                p={4}
                bg={"black"}
                borderRadius={"md"}
                boxShadow={"md"}
              >
                <CHeading size={"lg"}>{t("profiles.public")}</CHeading>
                <Text mt={4}>{t("profiles.public.text")}</Text>
                <Input
                  mt={4}
                  placeholder={t("profiles.search")}
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
                            bg={"gray.800"}
                            borderRadius={"md"}
                            mt={4}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            _hover={{
                              bg: "gray.700",
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
                                      <chakra.span color={"brand.500"}>
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
                bg={"black"}
                borderRadius={"md"}
                boxShadow={"md"}
              >
                <CHeading size={"lg"}>{t("posts")}</CHeading>
                <Text mt={4}>{t("posts.text")}</Text>
                <Input
                  mt={4}
                  placeholder={t("posts.search")}
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
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["forum"])),
  };
}
