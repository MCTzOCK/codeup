/**
 * apps/web/src/pages/api/ask/posts/t/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.06.23
 *
 */
import React, { useState } from "react";
import { IAskPost } from "../../../types/IAskPost";
import AskLayout from "@codeup/components/ask/AskLayout";
import PostCardV3 from "@codeup/components/ask/PostCardV3";
import { Heading, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import REST from "@codeup/rest/dist";
import { useRouter } from "next/router";
import { FaTimes } from "react-icons/fa";
import { useLoggedIn } from "@codeup/hooks";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ThreadViewer() {
  const [notFound, setNotFound] = React.useState(false);

  const [post, setPost] = React.useState<IAskPost>();
  const [comments, setComments] = React.useState<IAskPost[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [maxPage, setMaxPage] = useState<number>(0);

  const { loggedIn, userInfo } = useLoggedIn();
  const router = useRouter();

  React.useEffect(() => {
    if (router.query && router.query.id) {
      REST.Ask.getPost(router.query.id as string).then((res) => {
        if (res.status === 200) {
          setPost(res.payload.posts[0]);
          loadNextComments();
        } else {
          setNotFound(true);
        }
      });
    }
  }, [router]);

  const loadNextComments = () => {
    REST.Ask.getPostsByParent(router.query.id as string).then((res) => {
      setComments([...comments, ...res.payload.posts]);
      setPage(page + 1);
      setMaxPage(res.payload.pages);
    });
  };

  return (
    <>
      <AskLayout>
        <Stack
          flex={["100%", "100%", "100%", "90%"]}
          w={"100%"}
          roundedTopRight={"xl"}
          roundedBottomRight={"xl"}
          maxH={"100vh"}
          overflow={"auto"}
          bgColor={"black"}
          id={"scrollableDiv"}
        >
          {notFound ? (
            <>
              <HStack
                color={"red.400"}
                alignItems={"center"}
                w={"100%"}
                justifyContent={"center"}
                fontSize={"2xl"}
              >
                <FaTimes />
                <Text>Dieser Beitrag konnte nicht gefunden werden</Text>
              </HStack>
            </>
          ) : (
            <>
              {post && (
                <PostCardV3
                  post={post}
                  setPosts={() => {}}
                  loggedIn={loggedIn}
                  owner={post.username === userInfo.username}
                />
              )}
            </>
          )}
          <Heading size={"lg"} pl={4}>
            Kommentare
          </Heading>
          <InfiniteScroll
            next={loadNextComments}
            hasMore={page < maxPage && comments.length > 0}
            loader={<Spinner />}
            dataLength={comments.length}
            scrollableTarget="scrollableDiv"
          >
            {comments.map((p) => {
              return (
                <>
                  <PostCardV3
                    post={p}
                    loggedIn={loggedIn}
                    owner={
                      p.username === userInfo.username ||
                      userInfo.role === "admin"
                    }
                    setPosts={setComments}
                  />
                </>
              );
            })}
          </InfiniteScroll>
        </Stack>
      </AskLayout>
    </>
  );
}
