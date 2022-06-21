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
import {useEffect, useState} from 'react';
import useHasProfile from "../../hooks/hasProfile";
import useUserInfo from "../../hooks/useUserInfo";
import redirect from "../../util/userworkflow/redirect";
import {AiFillPlusSquare} from "react-icons/ai";
import {Box, Flex, Heading, Text} from "@chakra-ui/react";
import PostCard from "../../components/community/post/PostCard";
import {useRouter} from "next/router";
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

    const hasProfile = useHasProfile();

    return (
        <>
            {
                hasProfile.tried && hasProfile.hasProfile ?
                    <>
                        <CommunityFeed />
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
                    <Heading color={"white"} mt={"1.2rem"}>
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

function CommunityFeed() {
    const [postIds, setPostIds] = useState<string[]>([]);
    const [currentRange, setCurrentRange] = useState<{from: number, to: number}>({
        from: 0,
        to: 5
    })

    useEffect(() => {
        let origPosts = postIds;

        fetch("/api/community/feed?from=" + currentRange.from + "&to=" + currentRange.to + "&idsOnly=true&noReplies=true", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            res.json().then(data => {
                setPostIds(origPosts.concat(data.posts))
            })
        })
    }, [currentRange]);



    useEffect(() => {

        function handleScroll() {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                setCurrentRange({
                    from: currentRange.to,
                    to: currentRange.to + 5
                })
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentRange]);

    const router = useRouter();

    return (
        <Box p={["1.2rem", "2rem"]}>
            {
                postIds.map(postId => {
                    console.log(postId)
                    return (
                        <>
                            <Box cursor="pointer" onClick={() => {router.push("/community/post/" + postId)}}>
                                <PostCard id={postId}/>
                            </Box>
                        </>
                    )
                })
            }
        </Box>
    )
}