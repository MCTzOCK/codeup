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
import TipTap from "../../../components/community/post/TipTap";
import PostCard from "../../../components/community/post/PostCard";

export default function PostView() {

    const router = useRouter();

    const {id} = router.query;

    const [replies, setReplies] = useState<string[]>([])

    const toast = useToast();


    useEffect(() => {
        if(id) {
            fetch("/api/community/post/" + id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                res.json().then(data => {
                    if(data.success) {
                        if(data.post.parent !== null) {
                            router.push("/community/post/" + data.post.parent);
                            return;
                        }
                        setReplies(data.post.comments)
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
                    <PostCard id={id as string} />
                    <Heading size={"lg"} mt={"2rem"}>Replies</Heading>
                    {
                        replies.map((reply) => {
                            return (
                                // eslint-disable-next-line react/jsx-key
                                <Box mt={"2rem"}>
                                    <PostCard id={reply} />
                                </Box>
                            )
                        })
                    }
                </Box>
            </Flex>
        </>
    )
}

