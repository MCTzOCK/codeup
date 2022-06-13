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
import {Avatar, Badge, Box, Flex, Heading, Image, Text, Tooltip} from "@chakra-ui/react";
import {BsQuestionSquareFill} from "react-icons/bs";

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
                notFound ? <NotFound/> : <Profile profile={profile}/>
            }
        </>
    )
}

function NotFound() {
    return (
        <>
            <Flex alignItems={"center"} justifyContent={"center"} minW={"100%"} minH={"99vh"}>
                <Heading color={"green.300"} fontSize={"10rem"} textAlign={"center"} display={"flex"}
                         justifyContent={"center"} alignItems={"center"} flexDirection={"column"} as={"div"}>
                    <BsQuestionSquareFill/>
                    <Heading color={"white"} mt={"1.2rem"}>
                        Not Found
                    </Heading>
                    <Text color={"white"} fontSize={"1.2rem"} textDecoration={"none"} fontWeight={"normal"}
                          mt={"1.2rem"}>
                        The profile you are looking for does not exist.
                    </Text>
                </Heading>
            </Flex>
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
                            <ProfileBadges verified={props.profile.verified} specialStatus={props.profile.specialStatus} />
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

function ProfileBanner(props: {
    url: string
}) {
    return (
        <>
            <Image
                src={props.url}
                w={"100%"}
                h={[312, 624]}
                maxHeight={[250, 450]}
                maxW={"100vw"}
                style={{objectFit: "none"}}
                borderRadius={"12px"}
                borderTopRadius={0}
                alt={"Banner"}
                shadow={"lg"}
            />
        </>
    )
}

function ProfileAvatar(props: {
    url: string
}) {
    return (
        <>
            <Flex justifyContent={["center", "flex-start"]}>
                <Avatar
                    src={props.url}
                    w={128}
                    h={128}
                    mt={"-3rem"}
                    marginInlineStart={["0", "1rem"]}
                    borderColor={"#FFF"}
                    borderWidth={"4px"}
                />
            </Flex>
        </>
    )
}

function ProfileBadges(props: {
    verified: boolean,
    specialStatus: string
}) {
    return (
        <>
            <Flex
                direction={"row"}
                mt={".4rem"}
                marginInline={".4rem"}
                gap={"0"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                {props.verified ? (
                    <Tooltip label={"Official Account"} hasArrow>
                        <Badge
                            ml={"1"}
                            p={".2rem"}
                            colorScheme="green"
                            display={"block ruby"}
                        >
                            {" "}
                            Official
                        </Badge>
                    </Tooltip>
                ) : null}
                {props.specialStatus.length > 0 ? (
                    <Tooltip label={props.specialStatus} hasArrow>
                        <Badge
                            ml={"1"}
                            p={".2rem"}
                            colorScheme="yellow"
                            display={"block ruby"}
                        >
                            Special
                        </Badge>
                    </Tooltip>
                ) : null}
            </Flex>
        </>
    )
}