/**
 * apps/web/src/pages/forum/post/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import REST from "@codeup/rest";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import PostCardV2 from "@codeup/components/forum/PostCardV2";
import { useLoggedIn } from "@codeup/hooks";
import DeferredPostCardV2 from "@codeup/components/forum/DeferredPostCardV2";
import Head from "next/head";

export default function PostView() {
  const router = useRouter();

  const { id } = router.query;

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);

  const reloadPosts = () => {
    if (id) {
      REST.Forum.getPostV2(id as string).then(async (res) => {
        if (res.status === 200) {
          setPost(res.payload.post);

          const r = await REST.Forum.getCommentsV2(id as string);

          if (r.status === 200) {
            setComments(r.payload.comments);
          } else {
            router.push("/forum");
          }
        } else {
          router.push("/forum");
        }
      });
    }
  };

  useEffect(reloadPosts, [id, router]);

  return (
    <>
      <Head>
        <title>Forum Beitrag - CodeUp</title>
      </Head>
      {!post ? (
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          w={"100%"}
          h={"100vh"}
        >
          <Spinner size={"xl"} />
        </Flex>
      ) : null}
      {post ? (
        <>
          <Flex
            mt={[0, "2rem"]}
            mb={[0, "2rem"]}
            w={"100%"}
            justifyContent={"center"}
          >
            <Box
              w={"100%"}
              maxW={"600px"}
              p={4}
              borderRadius={"md"}
              boxShadow={"md"}
              bg={"gray.700"}
              position={"relative"}
            >
              <DeferredPostCardV2 post={post} reloadPosts={reloadPosts} />
              <Divider />
              <Heading size={"lg"} mt={4}>
                Kommentare
              </Heading>
              {post.parent !== null ? (
                <>
                  <Text mt={4} color={"gray.400"}>
                    Dieser Beitrag ist ein Kommentar auf einen anderen Beitrag.
                    Deshalb kann unter diesem Beitrag nicht kommentiert werden!
                  </Text>
                  <Divider mt={4} />
                  <Button
                    mt={8}
                    colorScheme={"green"}
                    onClick={() => {
                      router.push("/forum/post/" + post.parent);
                    }}
                  >
                    Original Beitrag aufrufen
                  </Button>
                </>
              ) : null}
              {post.parent === null ? (
                <>
                  {comments.map((comment) => {
                    return (
                      <DeferredPostCardV2
                        post={comment}
                        key={comment._id}
                        reloadPosts={reloadPosts}
                      />
                    );
                  })}
                  {comments.length === 0 ? (
                    <Text>Keine Kommentare vorhanden</Text>
                  ) : null}
                </>
              ) : null}
            </Box>
          </Flex>
        </>
      ) : null}
    </>
  );
}
