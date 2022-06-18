/**
 * src/pages/community/profile/[id].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.06.2022
 *
 */
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import redirect from "../../../util/userworkflow/redirect";
import {Box, Flex, Heading} from "@chakra-ui/react";
import ProfileBadges from "../../../components/community/profile/ProfileBadges";
import ProfileBanner from "../../../components/community/profile/ProfileBanner";
import ProfileAvatar from "../../../components/community/profile/ProfileAvatar";
import ProfileNotFound from "../../../components/community/profile/ProfileNotFound";

export default function ProfileView() {

    const router = useRouter();

    const [profile, setProfile] = useState({
        _id: "",
        user: "",
        profilePicture: "",
        profileBanner: "",
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
        __v: 0
    });

    const id = router.query.id;


    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        redirect({
            allowAnonymous: false,
            redirectTo: window.location.href,
            redirectToLogin: true,
            forceAnonymous: false
        })
    }, [])

    useEffect(() => {
        fetch("/api/community/profile/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            res.json().then(data => {
                if (res.status === 200) {
                    setProfile(data.profile)
                    setNotFound(false);
                } else {
                    setNotFound(true)
                }
            })
        })
    }, [id])


    return (
        <>
            {
                notFound ? <ProfileNotFound/> : <Profile profile={profile}/>
            }
        </>
    )
}

function Profile(props: {
    profile: {
        _id: string,
        user: string,
        profilePicture: string,
        profileBanner: string,
        displayName: string,
        verified: boolean,
        specialStatus: string,
        bio: string,
        location: string,
        birthday: string,
        sexuality: string,
        gender: string,
        followers: string[],
        createdAt: Date,
        __v: number
    }
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
                    minWidth={{base: "fit-content", xl: 1640}}
                >
                    <ProfileBanner url={props.profile.profileBanner}/>
                    <Flex flexDirection={["column", "row"]} flex={"100%"} gap={"1.2rem"}>
                        <ProfileAvatar url={props.profile.profilePicture}/>
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
                            <ProfileBadges verified={props.profile.verified}
                                           specialStatus={props.profile.specialStatus}/>
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

