/**
 * src/pages/community/post/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2022
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Flex, Heading, useToast } from "@chakra-ui/react";
import { useHasProfile } from "@codeup/hooks";
import { PostCard } from "@codeup/components/community/post";
import REST from "@codeup/rest";
import Head from "next/head";

export default function PostView() {
  const router = useRouter();

  const { id } = router.query;

  const [replies, setReplies] = useState<string[]>([]);

  const toast = useToast();

  const hasProfile = useHasProfile();

  useEffect(() => {
    if (hasProfile.tried && !hasProfile.hasProfile) {
      router.push("/community");
    }
  }, [hasProfile, router]);

  useEffect(() => {
    if (id) {
      if (typeof id === "string") {
        REST.Community.getPost(id).then((res) => {
          if (res.payload.success) {
            if (res.payload.post.parent !== null) {
              router.push("/community/post/" + res.payload.post.parent);
              return;
            }
            setReplies(res.payload.post.comments.reverse());
          } else {
            toast({
              title: "Fehler",
              description: res.payload.error,
              status: "error",
              duration: 9000,
              position: "top",
            });
          }
        });
      }
    }
  }, [router, id, toast]);

  return (
    <>
      <Head>
        <title>(Veraltet) Community Beitrag - CodeUp</title>
      </Head>
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
          <Heading size={"lg"} mt={"2rem"}>
            Kommentare
          </Heading>
          {replies.map((reply) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <Box mt={"2rem"}>
                <PostCard id={reply} />
              </Box>
            );
          })}
        </Box>
      </Flex>
    </>
  );
}
