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
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { FaHome, FaPlus, FaSearch } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import PostCardV3 from "@codeup/components/ask/PostCardV3";
import InfiniteScroll from "react-infinite-scroll-component";

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

  return (
    <>
      <Flex
        w={"100%"}
        h={"fit-content"}
        minH={"100vh"}
        direction={["column", "column", "column", "row"]}
        paddingInline={["0", "0", "0", "20%"]}
        paddingBlock={"2rem"}
      >
        <Flex
          flex={["100%", "100%", "100%", "10%"]}
          w={"100%"}
          roundedTopLeft={"xl"}
          roundedBottomLeft={"xl"}
          backgroundColor={"black"}
        >
          <Stack w={"100%"}>
            <IconButton
              aria-label={""}
              variant="ghost"
              size={"lg"}
              fontSize={"2xl"}
              p={"2rem"}
              icon={<FaHome />}
              rounded={"none"}
              roundedTopLeft={"xl"}
              onClick={() => {}}
            />
            <IconButton
              aria-label={""}
              variant="ghost"
              size={"lg"}
              fontSize={"2xl"}
              p={"2rem"}
              icon={<FaPlus />}
              rounded={"none"}
              onClick={() => {}}
            />
            <IconButton
              aria-label={""}
              variant="ghost"
              size={"lg"}
              fontSize={"2xl"}
              p={"2rem"}
              icon={<FaSearch />}
              rounded={"none"}
              onClick={() => {}}
            />
            <IconButton
              aria-label={""}
              variant="ghost"
              size={"lg"}
              fontSize={"2xl"}
              p={"2rem"}
              icon={<AiFillMessage />}
              rounded={"none"}
              onClick={() => {}}
            />
          </Stack>
        </Flex>

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
                    onClick={() => {}}
                    loggedIn={loggedIn}
                    owner={
                      p.username === userInfo.username ||
                      userInfo.role === "admin"
                    }
                    setPosts={setPosts}
                  />
                </>
              );
            })}
          </InfiniteScroll>
        </Stack>
      </Flex>
    </>
  );
}
