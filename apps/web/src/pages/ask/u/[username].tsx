/**
 * apps/web/src/pages/ask/u/[username].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.06.23
 *
 */
import { useRouter } from "next/router";
import React, { Component, useState } from "react";
import { IAskProfile } from "../../../types/IAskProfile";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import AskLayout from "@codeup/components/ask/AskLayout";
import REST from "@codeup/rest/src";
import { ProfileAvatar } from "@codeup/components/dist/community/profile";
import AskProfileCertificateDisplay from "@codeup/components/ask/AskProfileCertificateDisplay";
import AskProfileProjectDisplay from "@codeup/components/ask/AskProfileProjectDisplay";
import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  IconButton,
  Image,
  Link,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { HiBadgeCheck } from "react-icons/hi";
import { FaGlobe, FaPen } from "react-icons/fa";
import { useLoggedIn } from "@codeup/hooks";
import { IAskPost } from "../../../types/IAskPost";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCardV3 from "@codeup/components/dist/ask/PostCardV3";
import EditProfileModal from "@codeup/components/ask/EditProfileModal";
import { CHeading } from "@codeup/components/dist/global/CHeading";

export default function UserProfileViewer() {
  const router = useRouter();

  const [profile, setProfile] = React.useState<IAskProfile>();
  const [notFound, setNotFound] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (router.query && router.query.username) {
      const uName = (router.query.username as string).split("@")[1];

      REST.Ask.getProfile(uName).then((res) => {
        if (res.status === 200) {
          setProfile(res.payload.profile);
        } else {
          setNotFound(true);
        }
      });
    }
  }, [router, router.query]);

  const { userInfo, loggedIn } = useLoggedIn();

  const [posts, setPosts] = useState<IAskPost[]>([]);
  const [page, setPage] = useState<number>(0);
  const [maxPage, setMaxPage] = useState<number>(0);

  const loadNext = () => {
    if (!router || !router.query || !router.query.username) return;
    REST.Ask.getPostsByUser(
      (router.query.username as string).split("@")[1],
      page + 1
    ).then((res) => {
      let newPosts = [...posts, ...res.payload.posts];
      // remove duplicates
      newPosts = newPosts.filter(
        (post, index, self) =>
          index === self.findIndex((t) => t._id === post._id)
      );
      setPosts(newPosts);
      setPage(page + 1);
      setMaxPage(res.payload.pages);
    });
  };
  React.useEffect(loadNext, [router, router.query]);

  const { onOpen, onClose, isOpen } = useDisclosure();

  if (notFound) {
    return (
      <>
        <ErrorComponent
          description={"Das Profil konnte nicht gefunden werden!"}
        />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <AuthenticateLoadingIndicator text={"Lade Profil..."} />
      </>
    );
  }

  return (
    <>
      <AskLayout>
        <Box
          w={"100%"}
          flex={["100%", "100%", "100%", "90%"]}
          roundedTopRight={"xl"}
          roundedBottomRight={"xl"}
          bgColor={"black"}
          minH={"100vh"}
          h={"fit-content"}
        >
          <Image
            src={profile.banner}
            w={"100%"}
            h={[312, 624]}
            maxHeight={[250, 450]}
            maxW={"100vw"}
            objectFit={"cover"}
            borderRadius={"12px"}
            borderTopRadius={0}
            alt={"Banner"}
            shadow={"lg"}
          />
          <Flex flexDirection={["column", "row"]} flex={"100%"} gap={"1.2rem"}>
            <ProfileAvatar
              url={"/api/account/" + profile.username + "/picture"}
            />
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"row"}
              flex={"20%"}
              mt={"1rem"}
              ml={[0, "-128px"]}
              gap={4}
            >
              <CHeading size={"xl"}>@{profile.username}</CHeading>
              <Heading
                size={"lg"}
                display={"flex"}
                alignItems={"center"}
                gap={"1.2rem"}
              >
                {profile.badges.includes("verified") ? (
                  <>
                    <chakra.span color={"brand.500"}>
                      <HiBadgeCheck />
                    </chakra.span>
                  </>
                ) : null}
              </Heading>

              {userInfo.username === profile.username && (
                <IconButton
                  aria-label={"Bearbeiten"}
                  variant={"ghost"}
                  icon={<FaPen />}
                  colorScheme={"blue"}
                  onClick={onOpen}
                />
              )}
            </Flex>
          </Flex>
          <Flex
            direction={["column", "row"]}
            p={8}
            gap={6}
            alignItems={"center"}
          >
            {profile.bio && profile.bio.length > 0 ? (
              <Text mt={4} flex={["100%", "60%"]}>
                {profile.bio}
              </Text>
            ) : null}
            {profile.website.match(/(https?:\/\/[^\s]+)/g) ? (
              <Stack>
                <Button
                  as={Link}
                  href={profile.website}
                  variant={"ghost"}
                  leftIcon={<FaGlobe />}
                  isExternal={true}
                  target={"_blankw"}
                >
                  Webseite
                </Button>
              </Stack>
            ) : null}
          </Flex>
          <Box pt={4} pb={4}>
            <CHeading size={"xl"}>Zertifikate</CHeading>
          </Box>
          <AskProfileCertificateDisplay certificates={profile.certificates} />
          <Box pt={4} pb={4}>
            <CHeading size={"xl"}>Projekte</CHeading>
          </Box>
          <AskProfileProjectDisplay projects={profile.projects} />
          <Box pt={4} pb={4}>
            <CHeading size={"xl"}>Beiträge</CHeading>
          </Box>

          <Stack w={"100%"} roundedBottomRight={"xl"} overflow={"scroll"}>
            {posts.map((post) => {
              return <PostCardV3 post={post} setPosts={setPosts} />;
            })}
            <Button onClick={loadNext}>Mehr laden</Button>
          </Stack>
        </Box>
      </AskLayout>
      <EditProfileModal
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        profile={profile}
      />
    </>
  );
}
