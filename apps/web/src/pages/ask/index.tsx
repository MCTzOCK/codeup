/**
 * apps/web/src/pages/ask/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.06.23
 *
 */
import { useLoggedIn } from "@codeup/hooks";
import React, { useState } from "react";
import { IAskPost } from "../../types/IAskPost";
import REST from "@codeup/rest/dist";
import { Spinner, Stack } from "@chakra-ui/react";
import PostCardV3 from "@codeup/components/ask/PostCardV3";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/router";
import AskLayout from "@codeup/components/ask/AskLayout";

export default function Ask() {
  const { userInfo, loggedIn } = useLoggedIn();

  const [posts, setPosts] = useState<IAskPost[]>([]);
  const [page, setPage] = useState<number>(0);
  const [maxPage, setMaxPage] = useState<number>(0);

  const loadNext = () => {
    REST.Ask.getPosts(page + 1).then((res) => {
      setPosts([...posts, ...res.payload.posts]);
      setPage(page + 1);
      setMaxPage(res.payload.pages);
    });
  };
  React.useEffect(loadNext, []);
  const router = useRouter();

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
          id={"scrollableDiv"}
        >
          <InfiniteScroll
            next={loadNext}
            hasMore={page < maxPage && posts.length > 0}
            loader={<Spinner />}
            dataLength={posts.length}
            scrollableTarget="scrollableDiv"
          >
            {posts.map((p) => {
              return (
                <>
                  <PostCardV3
                    post={p}
                    loggedIn={loggedIn}
                    owner={
                      p.username === userInfo.username ||
                      userInfo.role === "admin"
                    }
                    setPosts={setPosts}
                    onClick={() => {
                      router.push("/ask/t/" + p._id);
                    }}
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
