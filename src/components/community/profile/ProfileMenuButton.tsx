/**
 * src/components/community/profile/ProfileMenuButtonj.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.06.2022
 *
 */

import * as React from 'react';
import {Box, IconButton, Link, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {GiHamburgerMenu} from "react-icons/gi";
import {useEffect, useState} from "react";
import useUserInfo from "../../../hooks/useUserInfo";

export default function ProfileMenuButton(props: {
    profile: {
        website: string,
        username: string
    },
    editProfile: {
        onEditOpen: () => void,
        onEditClose: () => void,
        isEditOpen: boolean
    }
}) {

    const [isOwner, setIsOwner] = useState(false);

    const userInfo = useUserInfo();

    useEffect(() => {
        if(userInfo.username === props.profile.username) {
            setIsOwner(true);
        }
    }, [userInfo])

    return (
        <Box mt={"1.2rem"} textAlign={"center"}>
            <Menu>
                <MenuButton as={IconButton} icon={<GiHamburgerMenu />} colorScheme={"gray"}>
                    Actions
                </MenuButton>
                <MenuList>
                    {
                        props.profile.website.length > 0 ? (
                            <MenuItem onClick={() => {
                                window.open(props.profile.website, "_blank")
                            }}>Website</MenuItem>
                        ) : null
                    }
                    <MenuItem onClick={props.editProfile.onEditOpen}>
                        Edit
                    </MenuItem>
                    <MenuItem onClick={() => {
                        window.location.href = "/community/profile/" + props.profile.username + "/report"
                    }}>Report</MenuItem>
                </MenuList>
            </Menu>
        </Box>
    )
}