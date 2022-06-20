/**
 * src/components/community/post/PostCard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2022
 *
 */

import * as React from 'react';
import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    IconButton,
    Menu,
    MenuButton, MenuItem, MenuList,
    Text,
    useToast
} from "@chakra-ui/react";
import {FaComment, FaHamburger, FaHeart, FaRegHeart} from "react-icons/fa";
import useUserInfo from "../../../hooks/useUserInfo";
import {useEffect, useState} from "react";
import TipTap from "./TipTap";
import {useRouter} from "next/router";
import {GiHamburgerMenu} from "react-icons/gi";

export default function PostCard(props: {
    id: string
}) {

    const userInfo = useUserInfo();
    const toast = useToast();
    const router = useRouter();
    const [showEditor, setShowEditor] = useState(false);

    const [post, setPost] = useState<{
        _id: string,
        user: string,
        username: string,
        content: string,
        createdAt: Date,
        likes: string[],
        comments: string[],
        parent: string | null
    }>({
        _id: "",
        user: "",
        username: "",
        content: "",
        createdAt: new Date(),
        likes: [],
        comments: [],
        parent: null
    });

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

    useEffect(() => {
        if(props.id) {
            fetch("/api/community/post/" + props.id, {
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
    }, [router]);

    return (
        <>
            <Flex direction={"column"} mt={"2rem"}>
                <Flex direction={"row"}>
                    <Avatar
                        src={"/api/community/profile/" + post.username + "/avatar"}
                        size={"lg"}
                        onClick={() => {
                            location.href = "/community/profile/" + post.username
                        }}
                        cursor={"pointer"}
                    />
                    <Flex direction={"column"} ml={"1rem"} flex={"100%"}>
                        <Heading as={"h1"} fontSize={["3xl", "4xl"]}>
                            {authorData.displayName}
                        </Heading>
                        <Text color={"gray.500"}>
                            @{authorData.username}
                        </Text>
                        <Text color={"gray.500"} _hover={{
                            textDecoration: "none"
                        }}>
                            {new Date(post.createdAt).getFullYear()}/{new Date(post.createdAt).getMonth() + 1}/{new Date(post.createdAt).getDate()}&nbsp;
                            {new Date(post.createdAt).getHours()}:{new Date(post.createdAt).getMinutes()}
                        </Text>
                    </Flex>
                    <Box flex={"100%"} textAlign={"right"}>
                        <Menu>
                            <MenuButton as={IconButton} icon={<GiHamburgerMenu />} />
                            <MenuList>
                                {
                                    userInfo.username === post.username ?
                                        <MenuItem onClick={() => {
                                            fetch("/api/community/post/" + post._id + "/delete", {
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
                                                        toast({
                                                            title: "Success",
                                                            description: "Post deleted",
                                                            status: "success",
                                                            duration: 6000,
                                                            position: "top",
                                                            onCloseComplete: () => {
                                                                if(!post.parent) {
                                                                    router.push("/community");
                                                                }
                                                            }
                                                        })
                                                    } else {
                                                        toast({
                                                            title: "Error",
                                                            description: data.error,
                                                            status: "error",
                                                            duration: 6000,
                                                            position: "top"
                                                        })
                                                    }
                                                })
                                            })
                                        }}>
                                            Delete
                                        </MenuItem>
                                        : null
                                }
                                <MenuItem onClick={() => {
                                    navigator.clipboard
                                        .writeText("https://" + window.location.host + "/community/post/" + post._id)
                                        .then(() => {
                                            toast({
                                                title: "Success!",
                                                description: "Link copied to clipboard",
                                                status: "success",
                                                duration: 3000,
                                                isClosable: true,
                                                position: "top",
                                            });
                                        });
                                }}>
                                    Share
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>
            <Flex direction={"column"} id={"post-display"}>
                <div style={{ marginTop: ".5rem", marginBottom: ".5rem" }} dangerouslySetInnerHTML={{__html: post.content}}/>
                <Divider/>
                <Flex direction={"row"} justifyContent={"space-between"}>
                    <Flex direction={"row"} w={"100%"} justifyContent={"center"} mt={".7rem"} mb={".7rem"}>
                        <Button aria-label={"Likes"}
                                rightIcon={post.likes.includes(userInfo.id) ? <FaHeart/> : <FaRegHeart/>}
                                flex="100%" onClick={() => {
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
                                    if (data.success) {
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
                        {
                            !post.parent ?
                                <Button aria-label={"Comments"} rightIcon={<FaComment/>} flex="100%" onClick={() => {
                                    setShowEditor(!showEditor)
                                }} variant={"ghost"} size={"lg"}>
                                    {post.comments.length}&nbsp;
                                </Button>
                                : null
                        }
                    </Flex>
                </Flex>
            </Flex>
            <Divider />
            {
                showEditor && !post.parent ?
                    <Box backgroundColor={"gray.900"} p={"1.2rem"} mt={".5rem"} rounded={"xl"}>
                        <TipTap parentPost={post._id} setShowEditor={setShowEditor} />
                    </Box>
                    :
                    null
            }
        </>
    )
}