/**
 * src/pages/community/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.06.2022
 *
 */

import * as React from 'react';
import {useEffect} from 'react';
import useHasProfile from "../../hooks/hasProfile";
import useUserInfo from "../../hooks/useUserInfo";
import redirect from "../../util/userworkflow/redirect";
import {AiFillPlusSquare} from "react-icons/ai";
import {Flex, Heading, Text} from "@chakra-ui/react";
import Link from "next/link";

export default function CommunityHome() {

    useEffect(() => {
        redirect({
            allowAnonymous: false,
            redirectTo: '/community',
            redirectToLogin: true,
            forceAnonymous: false
        })
    }, [])

    const userInfo = useUserInfo();

    const hasProfile = useHasProfile(userInfo.id);

    return (
        <>
            {
                hasProfile.tried && hasProfile.hasProfile ?
                    <>
                    </>
                    :
                    <>
                        <ProfileCreatorHero/>
                    </>
            }
        </>
    )
}

function ProfileCreatorHero() {

    return (
        <Link href={"/community/profile/create"}>
            <Flex alignItems={"center"} justifyContent={"center"} minW={"100%"} minH={"99vh"} cursor={"pointer"}>
                <Heading color={"green.300"} fontSize={"10rem"} textAlign={"center"} display={"flex"}
                         justifyContent={"center"} alignItems={"center"} flexDirection={"column"} as={"div"}>
                    <AiFillPlusSquare/>
                    <Heading color={"white"}>
                        Create your profile
                    </Heading>
                    <Text color={"white"} fontSize={"1.2rem"} textDecoration={"none"} fontWeight={"normal"}
                          mt={"1.2rem"}>
                        Create a profile to start sharing your skills and get feedback from other users.
                    </Text>
                </Heading>
            </Flex>
        </Link>
    )
}