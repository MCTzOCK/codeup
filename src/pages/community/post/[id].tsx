/**
 * src/pages/community/post/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2022
 *
 */

import * as React from 'react';
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Avatar, Box, Button, Divider, Flex, Heading, IconButton, Text, useToast} from "@chakra-ui/react";
import ProfileBadges from "../../../components/community/profile/ProfileBadges";
import {FaComment, FaHeart, FaRegHeart} from "react-icons/fa";
import useUserInfo from "../../../hooks/useUserInfo";

export default function PostView() {

    const [post, setPost] = useState<{
        _id: string,
        user: string,
        username: string,
        content: string,
        createdAt: Date,
        likes: string[],
        comments: string[],
    }>({
        _id: "",
        user: "",
        username: "",
        content: "",
        createdAt: new Date(),
        likes: [],
        comments: [],
    })

    const [authorData, setAuthorData] = useState<{
        _id: string,
        user: string,
        username: string,
        profilePicture: string,
        profileBanner: string,
        displayName: string,
        verified: boolean,
        specialStatus: string,
        bio: string,
        location: string,
        birthday: string,
        website: string,
        followers: string[],
    }>({
        _id: "",
        user: "",
        username: "",
        profilePicture: "",
        profileBanner: "",
        displayName: "",
        verified: false,
        specialStatus: "",
        bio: "",
        location: "",
        birthday: "",
        website: "",
        followers: [],
    })

    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        const id = router.query.id;
        if(id) {
            fetch("/api/community/post/" + id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                res.json().then(data => {
                    if(data.success) {
                        setPost(data.post);
                    } else {
                        toast({
                            title: "Error",
                            description: data.error,
                            status: "error",
                            duration: 9000,
                            position: "top"
                        })
                    }
                })
            })
        }
    }, [router])

    useEffect(() => {
        if(post.username !== "") {
            fetch("/api/community/profile/" + post.username, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                res.json().then(data => {
                    if(data.success) {
                        setAuthorData(data.profile);
                    } else {
                        toast({
                            title: "Error",
                            description: data.error,
                            status: "error",
                            duration: 9000,
                            position: "top"
                        })
                    }
                })
            })
        }
    }, [post])

    const userInfo = useUserInfo();

    return (
        <>
            <Flex
                justifyContent={"center"}
                alignItems={"center"}
                direction={"column"}
                width={"100%"}
                paddingInline={".4rem"}
            >
                <Box
                    maxWidth={["100%", "40%"]}
                    minHeight={[312, 624]}
                    minWidth={["100%", "40%"]}
                    mt={"2rem"}
                >
                    <Flex direction={"column"}>
                        <Flex direction={"row"} _hover={{ textDecoration: "underline" }} cursor={"pointer"} onClick={() => {
                            router.push("/community/profile/" + post.username)
                        }}>
                            <Avatar
                                src={"/api/community/profile/" + post.username + "/avatar"}
                                size={"lg"}
                            />
                            <Flex direction={"column"} ml={"1rem"}>
                                <Heading as={"h1"} fontSize={["3xl", "4xl"]}>
                                    {authorData.displayName}
                                </Heading>
                                <Text color={"gray.500"}>
                                    @{authorData.username}
                                </Text>
                                <Text color={"gray.500"}>
                                    {new Date(post.createdAt).getFullYear()}/{new Date(post.createdAt).getMonth() + 1}/{new Date(post.createdAt).getDate()}&nbsp;
                                    {new Date(post.createdAt).getHours()}:{new Date(post.createdAt).getMinutes()}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex direction={"column"} id={"post-display"}>
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        <Divider />
                        <Flex direction={"row"} justifyContent={"space-between"}>
                            <Flex direction={"row"} w={"100%"} justifyContent={"center"} mt={"1.2rem"}>
                                <Button aria-label={"Likes"} rightIcon={post.likes.includes(userInfo.id) ? <FaHeart /> : <FaRegHeart />} flex="100%" onClick={() => {
                                    fetch("/api/community/post/" + post._id + "/like", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            token: localStorage.getItem("token")
                                        })
                                    }).then(res => {
                                        res.json().then(data => {
                                            if(data.success) {
                                                setPost(data.post);
                                            } else {
                                                toast({
                                                    title: "Error",
                                                    description: data.error,
                                                    status: "error",
                                                    duration: 9000,
                                                    position: "top"
                                                })
                                            }
                                        })
                                    })
                                }} variant={"ghost"} size={"lg"}>
                                    {post.likes.length}&nbsp;
                                </Button>
                                <Button aria-label={"Comments"} rightIcon={<FaComment />} flex="100%" onClick={() => {}} variant={"ghost"} size={"lg"}>
                                    {post.comments.length}&nbsp;
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

