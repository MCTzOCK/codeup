/**
 * src/components/community/profile/ProfileDataDisplay.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.06.2022
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

export default function ProfileDataDisplay(props: {
  profile: {
    username: string;
    displayName: string;
  };
}) {
  const [followersCount, setFollowersCount] = useState(0);
  const {
    isOpen: isFollowerOpen,
    onOpen: onFollowerOpen,
    onClose: onFollowerClose,
  } = useDisclosure();
  const { t } = useTranslation();

  useEffect(() => {
    fetch(
      "/api/community/profile/" +
        props.profile.username +
        "/followers?count=true",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      res.json().then((data) => {
        if (res.status === 200) {
          setFollowersCount(data.count);
        }
      });
    });
  }, [props.profile]);

  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    if (props.profile.username.length > 0) {
      fetch("/api/community/profile/" + props.profile.username + "/followers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        res.json().then((data) => {
          let f: any[] = [];
          console.log(data.followers);

          data.followers.forEach(async (follower: string) => {
            const r = await fetch("/api/community/profile/" + follower);

            const j = await r.json();

            f.push({
              username: j.profile.username,
              displayName: j.profile.displayName,
              avatar: j.profile.profilePicture,
              bio: j.profile.bio,
            });
          });
          setFollowers(f as never[]);
        });
      });
    }
  }, [props.profile]);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={onFollowerOpen}>
            {followersCount}&nbsp;{t("community:follower")}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Modal
        isOpen={isFollowerOpen}
        onClose={onFollowerClose}
        isCentered
        size={["full", "lg"]}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {props.profile.displayName}&apos;s&nbsp;{t("community:followers")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={"column"} justifyContent={"center"}>
              {followers.map((follower: any) => {
                return (
                  <>
                    <Flex
                      direction={"row"}
                      mb={"1.2rem"}
                      cursor={"pointer"}
                      onClick={() => {
                        window.location.href =
                          "/community/profile/" + follower.username;
                      }}
                    >
                      <Avatar
                        src={follower.avatar}
                        size={"lg"}
                        borderColor={"#FFF"}
                        borderWidth={"2px"}
                      />
                      <Flex direction={"column"} ml={"1.2rem"}>
                        <Heading as={"h1"} fontSize={["2xl", "3xl"]}>
                          {follower.displayName}
                        </Heading>
                        <Text color={"gray.500"}>@{follower.username}</Text>
                      </Flex>
                    </Flex>
                    <Divider />
                  </>
                );
              })}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
