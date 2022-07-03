/**
 * src/pages/community/profile/[id].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.06.2022
 *
 */
import { PostCard } from "@codeup/components/community/post";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { default as redirect } from "@codeup/util/src/userworkflow/redirect";
import {
  Avatar,
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
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import {
  ProfileAvatar,
  ProfileAvatarModifier,
  ProfileBadges,
  ProfileBanner,
  ProfileBannerModifier,
  ProfileDataDisplay,
  ProfileMenuButton,
  ProfileNotFound,
} from "@codeup/components/community/profile";

import {
  FaBirthdayCake,
  FaCheckCircle,
  FaGlobe,
  FaInfo,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useHasProfile, useUserInfo } from "@codeup/hooks";

//
// we need to disable SSR until I finally know
// why this page is throwing a Hydration Error
//
// Future me, forgive me.
// ~ Ben 24.06.2022
// Please rewrite the whole component
// and split it into more subcomponents
// to clean up the f*cking mess of JSX code
//
// nvm, this error only affects development builds
// I am really sorry, future me, that you have to deal
// with this in developing mode.
// please forgive me. You can safely delete the SSR disabling code
// btw, it never worked :(
//
const SSR = typeof window === "undefined";

export default function ProfileView() {
  const router = useRouter();

  const [profile, setProfile] = useState({
    _id: "",
    user: "",
    profilePicture: "",
    profileBanner: "",
    username: "",
    displayName: "",
    verified: false,
    specialStatus: "",
    bio: "",
    location: "",
    birthday: "",
    sexuality: "",
    gender: "",
    followers: [],
    createdAt: new Date(),
    website: "",
    __v: 0,
  });

  const name = router.query.name;

  const [notFound, setNotFound] = useState(false);
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const hasProfile = useHasProfile();

  const [displayNameValid, setDisplayNameValid] = useState(true);
  const [bioValid, setBioValid] = useState(true);
  const [locationValid, setLocationValid] = useState(true);
  const [birthdayValid, setBirthdayValid] = useState(true);
  const [websiteValid, setWebsiteValid] = useState(true);

  const toast = useToast();

  const {
    isOpen: isAvatarEditOpen,
    onOpen: onAvatarEditOpen,
    onClose: onAvatarEditClose,
  } = useDisclosure();
  const {
    isOpen: isBannerEditOpen,
    onOpen: onBannerEditOpen,
    onClose: onBannerEditClose,
  } = useDisclosure();

  const [currentRange, setCurrentRange] = useState({
    from: 0,
    to: 5,
  });

  const [currentPosts, setCurrentPosts] = useState([]);
  const [maxPosts, setMaxPosts] = useState(0);

  const userInfo = useUserInfo();

  useEffect(() => {
    redirect({
      allowAnonymous: false,
      redirectTo: window.location.href,
      redirectToLogin: true,
      forceAnonymous: false,
    });
  }, []);

  useEffect(() => {
    fetch("/api/community/profile/" + name, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        if (res.status === 200) {
          setProfile(data.profile);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      });
    });
  }, [name, userInfo]);

  useEffect(() => {
    if (hasProfile.tried && !hasProfile.hasProfile) {
      router.push("/community");
    }
  }, [hasProfile, router]);

  useEffect(() => {
    if (name !== undefined) {
      fetch(
        "/api/community/profile/" +
          name +
          "/posts?from=" +
          currentRange.from +
          "&to=" +
          currentRange.to,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => {
        res.json().then((data) => {
          if (res.status === 200) {
            setCurrentPosts(data.posts);
          } else {
            toast({
              title: "Error",
              description: "Could not load posts",
              status: "error",
              duration: 6000,
              isClosable: false,
            });
          }
        });
      });
    }
  }, [currentRange, name, toast]);

  useEffect(() => {
    if (name !== undefined) {
      fetch("/api/community/profile/" + name + "/posts?count=true", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        res.json().then((data) => {
          if (res.status === 200) {
            setMaxPosts(data.postCount);
          } else {
            toast({
              title: "Error",
              description: "Could not load posts",
              status: "error",
              duration: 6000,
              isClosable: false,
            });
          }
        });
      });
    }
  }, [name, toast]);

  return (
    <>
      {SSR ? null : (
        <>
          {notFound ? (
            <ProfileNotFound />
          ) : (
            <Profile
              profile={profile}
              editProfile={{
                isEditOpen,
                onEditOpen,
                onEditClose,
              }}
              range={{
                currentRange,
                setCurrentRange,
              }}
              currentPosts={currentPosts}
              maxPosts={maxPosts}
              key={"p-ro-file-000"}
            />
          )}
          <ProfileAvatarModifier
            isOpen={isAvatarEditOpen}
            onOpen={onAvatarEditOpen}
            onClose={onAvatarEditClose}
          />
          <ProfileBannerModifier
            isOpen={isBannerEditOpen}
            onOpen={onBannerEditOpen}
            onClose={onBannerEditClose}
          />
          <Drawer
            isOpen={isEditOpen}
            placement="left"
            onClose={onEditClose}
            size={["full", "lg"]}
          >
            <DrawerOverlay />
            <DrawerContent overflow={"auto"}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  setDisplayNameValid(true);
                  setBioValid(true);
                  setLocationValid(true);
                  setBirthdayValid(true);
                  setWebsiteValid(true);

                  const displayName = (
                    document.getElementById("displayName") as HTMLInputElement
                  ).value;
                  const bio = (
                    document.getElementById("biography") as HTMLTextAreaElement
                  ).value;
                  const location = (
                    document.getElementById("location") as HTMLInputElement
                  ).value;
                  const birthday = (
                    document.getElementById("birthday") as HTMLInputElement
                  ).value;
                  const website = (
                    document.getElementById("website") as HTMLInputElement
                  ).value;

                  if (!(displayName.length > 0 && displayName.length < 51)) {
                    setDisplayNameValid(false);
                    return;
                  }

                  if (!(bio.length > 0 && bio.length < 201)) {
                    setBioValid(false);
                    return;
                  }

                  if (website.length > 0) {
                    if (
                      !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
                        website
                      )
                    ) {
                      setWebsiteValid(false);
                      return;
                    }
                  }

                  if (!(location.length < 51)) {
                    setLocationValid(false);
                    return;
                  }

                  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
                    setBirthdayValid(false);
                    return;
                  }

                  fetch("/api/community/profile/update", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      token: localStorage.getItem("token"),
                      update: {
                        displayName,
                        bio,
                        location,
                        birthday,
                        website,
                      },
                    }),
                  }).then((res) => {
                    if (res.status === 200) {
                      toast({
                        title: "Profile updated",
                        description:
                          "Your profile has been updated successfully",
                        status: "success",
                        position: "top",
                        duration: 3000,
                        onCloseComplete: () => {
                          window.location.reload();
                        },
                      });
                    } else {
                      toast({
                        title: "Error",
                        description: "Your profile could not be updated.",
                        status: "error",
                      });
                    }
                  });
                }}
              >
                <DrawerCloseButton />
                <DrawerHeader>Edit Profile</DrawerHeader>

                <DrawerBody>
                  <Flex flexDirection="column" gap={"2rem"}>
                    <Box textAlign={"center"}>
                      <Avatar
                        src={profile.profilePicture}
                        w={128}
                        h={128}
                        borderColor={"#FFF"}
                        borderWidth={"4px"}
                        cursor={"pointer"}
                        _hover={{
                          filter: "brightness(0.7)",
                        }}
                        onClick={onAvatarEditOpen}
                      />
                    </Box>
                    <Box textAlign={"center"}>
                      <Image
                        alt={"Profile Banner"}
                        src={profile.profileBanner}
                        w={"100%"}
                        borderColor={"#FFF"}
                        borderWidth={"4px"}
                        cursor={"pointer"}
                        _hover={{
                          filter: "brightness(0.7)",
                        }}
                        onClick={onBannerEditOpen}
                      />
                    </Box>
                    <FormControl isInvalid={!displayNameValid}>
                      <FormLabel>Display Name</FormLabel>
                      <Input
                        id={"displayName"}
                        placeholder={"Display Name"}
                        defaultValue={profile.displayName}
                      />
                      <FormErrorMessage>
                        Display Name is invalid.
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!bioValid}>
                      <FormLabel>Biography</FormLabel>
                      <Textarea
                        id={"biography"}
                        placeholder={"Biography"}
                        defaultValue={profile.bio}
                        maxLength={256}
                      />
                      <FormErrorMessage>Biography is invalid.</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!websiteValid}>
                      <FormLabel>Website</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>
                          <FaGlobe />
                        </InputLeftAddon>
                        <Input
                          id={"website"}
                          placeholder={"Website"}
                          defaultValue={profile.website}
                        />
                      </InputGroup>
                      <FormErrorMessage>Website is invalid.</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!locationValid}>
                      <FormLabel>Location</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>
                          <FaMapMarkerAlt />
                        </InputLeftAddon>
                        <Input
                          id={"location"}
                          placeholder={"Location"}
                          defaultValue={profile.location}
                        />
                      </InputGroup>
                      <FormErrorMessage>Location is invalid.</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!birthdayValid}>
                      <FormLabel>Birthday</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>
                          <FaBirthdayCake />
                        </InputLeftAddon>
                        <Input
                          id={"birthday"}
                          type={"date"}
                          placeholder={"Birthday"}
                          defaultValue={profile.birthday}
                        />
                      </InputGroup>
                      <FormErrorMessage>Birthday is invalid.</FormErrorMessage>
                    </FormControl>
                  </Flex>
                </DrawerBody>

                <DrawerFooter>
                  <Button variant="outline" mr={3} onClick={onEditClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" type={"submit"}>
                    Save
                  </Button>
                </DrawerFooter>
              </form>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </>
  );
}

function Profile(props: {
  profile: {
    _id: string;
    user: string;
    username: string;
    profilePicture: string;
    profileBanner: string;
    displayName: string;
    verified: boolean;
    specialStatus: string;
    bio: string;
    location: string;
    birthday: string;
    sexuality: string;
    gender: string;
    followers: string[];
    createdAt: Date;
    website: string;
    __v: number;
  };
  editProfile: {
    onEditOpen: () => void;
    onEditClose: () => void;
    isEditOpen: boolean;
  };
  range: {
    currentRange: { from: number; to: number };
    setCurrentRange: ({ from, to }: { from: number; to: number }) => void;
  };
  currentPosts: {
    _id: string;
    user: string;
    username: string;
    content: string;
    createdAt: string;
    likes: string[];
    comments: string[];
    parent: string | null;
  }[];
  maxPosts: number;
}) {
  return (
    <>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        direction={"column"}
      >
        <Box
          maxWidth={1640}
          minHeight={[312, 624]}
          minWidth={{ base: "fit-content", xl: 1640 }}
        >
          <ProfileBanner url={props.profile.profileBanner} />
          <Flex flexDirection={["column", "row"]} flex={"100%"} gap={"1.2rem"}>
            <ProfileAvatar url={props.profile.profilePicture} />
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"column"}
              flex={"20%"}
              mt={"1rem"}
              ml={[0, "-128px"]}
            >
              <Heading as={"h1"} fontSize={["3xl", "4xl"]}>
                {props.profile.displayName}
              </Heading>
              <Text color={"gray.500"}>@{props.profile.username}</Text>
              <ProfileDataDisplay
                profile={{
                  username: props.profile.username,
                  displayName: props.profile.displayName,
                }}
              />
              <ProfileBadges
                verified={props.profile.verified}
                specialStatus={props.profile.specialStatus}
              />
            </Flex>
            <ProfileMenuButton
              profile={{
                website: props.profile.website,
                username: props.profile.username,
              }}
              editProfile={props.editProfile}
            />
          </Flex>
          <Box w={"100%"} alignItems={"center"} justifyContent={"center"}>
            <Flex
              direction={["column", "row"]}
              mt={"4rem"}
              gap={"2rem"}
              maxW={"100%"}
              p={"2rem"}
            >
              <Box flex={["100%", "40%"]}>
                <Box
                  bg={"gray.900"}
                  paddingInline={"2rem"}
                  paddingBlock={"1.2rem"}
                  borderRadius={"12px"}
                  w={"100%"}
                >
                  <Heading as={"h2"} fontSize={["2xl", "3xl"]}>
                    About
                  </Heading>
                  <Text
                    textAlign={"left"}
                    fontFamily={"Comic Sans MS, Comic Sans"}
                  >
                    &quot;{props.profile.bio}&quot;
                  </Text>
                  <Heading as={"h2"} fontSize={["2xl", "3xl"]} mt={"2rem"}>
                    Information
                  </Heading>
                  <Box textAlign={"left"} color={"gray.400"}>
                    {props.profile.verified ? (
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={".4rem"}
                        mt={".3rem"}
                        color={"green.400"}
                      >
                        <FaCheckCircle />
                        &nbsp;Official Account
                      </Box>
                    ) : null}
                    {props.profile.specialStatus.length > 0 ? (
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={".4rem"}
                        mt={".3rem"}
                        color={"yellow.400"}
                      >
                        <FaInfo /> {props.profile.specialStatus}
                      </Box>
                    ) : null}
                    {props.profile.location.length > 0 ? (
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={".4rem"}
                        mt={".3rem"}
                      >
                        <FaMapMarkerAlt /> {props.profile.location}
                      </Box>
                    ) : null}
                    {props.profile.birthday.length > 0 ? (
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={".4rem"}
                        mt={".3rem"}
                      >
                        <FaBirthdayCake />
                        &nbsp;
                        {new Date(props.profile.birthday).toLocaleDateString()}
                      </Box>
                    ) : null}
                  </Box>
                </Box>
              </Box>
              <Box flex={["100%", "60%"]}>
                <Heading mb={"4rem"} textAlign={"center"}>
                  Posts
                </Heading>
                {props.currentPosts.map((post) => {
                  // eslint-disable-next-line react/jsx-key
                  return <PostCard id={post._id} />;
                })}

                <ButtonGroup mt={"4"} w={"100%"}>
                  <Button
                    flex={"100%"}
                    disabled={props.range.currentRange.from === 0}
                    onClick={() => {
                      props.range.setCurrentRange({
                        from: props.range.currentRange.from - 5,
                        to: props.range.currentRange.to - 5,
                      });
                    }}
                  >
                    Previous
                  </Button>
                  <Button
                    flex={"100%"}
                    disabled={!(props.range.currentRange.to < props.maxPosts)}
                    onClick={() => {
                      props.range.setCurrentRange({
                        from: props.range.currentRange.from + 5,
                        to: props.range.currentRange.to + 5,
                      });
                    }}
                  >
                    Next
                  </Button>
                </ButtonGroup>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </>
  );
}
