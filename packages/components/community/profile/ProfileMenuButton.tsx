/**
 * src/components/community/profile/ProfileMenuButtonj.tsx
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
  Box,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useUserInfo } from "@codeup/hooks";
import { FaMinus, FaPlus } from "react-icons/fa";
import REST from "@codeup/rest";

export default function ProfileMenuButton(props: {
  profile: {
    website: string;
    username: string;
  };
  editProfile: {
    onEditOpen: () => void;
    onEditClose: () => void;
    isEditOpen: boolean;
  };
}) {
  const [isOwner, setIsOwner] = useState(false);

  const userInfo = useUserInfo();

  useEffect(() => {
    if (userInfo.username === props.profile.username) {
      setIsOwner(true);
    }
  }, [userInfo, props.profile.username]);

  const [isFollowing, setFollowing] = useState(false);

  useEffect(() => {
    if (userInfo.username.length > 0 && props.profile.username.length > 0) {
      REST.Community.isFollowing(
        props.profile.username,
        userInfo.username
      ).then((res) => {
        if (res.status === 200) {
          setFollowing(res.payload.isFollowing);
        } else {
          setFollowing(false);
        }
      });
    }
  }, [userInfo, props.profile.username]);

  return (
    <Box mt={"1.2rem"} textAlign={"center"}>
      <Button
        marginRight={"2rem"}
        colorScheme={isFollowing ? "red" : "blue"}
        leftIcon={isFollowing ? <FaMinus /> : <FaPlus />}
        onClick={async () => {
          const res = await REST.Community.toggleFollow({
            token: localStorage.getItem("token") as string,
            profile: props.profile.username,
          });

          if (res.status === 200) {
            setFollowing(res.payload.following);
          }
        }}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<GiHamburgerMenu />}
          colorScheme={"gray"}
        >
          Aktionen
        </MenuButton>
        <MenuList>
          {props.profile.website.length > 0 ? (
            <MenuItem
              onClick={() => {
                window.open(props.profile.website, "_blank");
              }}
            >
              Website
            </MenuItem>
          ) : null}
          {isOwner ? (
            <MenuItem onClick={props.editProfile.onEditOpen}>Edit</MenuItem>
          ) : null}
          <MenuItem
            onClick={() => {
              window.location.href =
                "/community/profile/" + props.profile.username + "/report";
            }}
          >
            Melden
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}
