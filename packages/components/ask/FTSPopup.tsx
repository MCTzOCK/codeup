/**
 * packages/components/ask/FTSPopup.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.06.23
 *
 */

import React from "react";
import CodeUpModal from "../codeup/CodeUpModal";
import { IAskPost } from "@codeup/web/src/types/IAskPost";
import REST from "@codeup/rest/dist";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import PostCardV3 from "./PostCardV3";
import { useLoggedIn } from "@codeup/hooks";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/router";

export default function FTSPopup(props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [query, setQuery] = React.useState<string>("");
  const [posts, setPosts] = React.useState<IAskPost[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [maxPages, setMaxPages] = React.useState<number>(0);

  const updateResults = () => {
    REST.Ask.searchPosts(query, 1).then((res) => {
      setPosts(res.payload.posts);
      setPage(1);
      setMaxPages(res.payload.pages);
    });
  };

  const loadNext = () => {
    REST.Ask.searchPosts(query, page + 1).then((res) => {
      setPosts([...posts, ...res.payload.posts]);
      setPage(page + 1);
      setMaxPages(res.payload.pages);
    });
  };

  React.useEffect(updateResults, [query]);

  const { loggedIn, userInfo } = useLoggedIn();
  const router = useRouter();

  return (
    <>
      <CodeUpModal
        onOpen={props.onOpen}
        onClose={props.onClose}
        isOpen={props.isOpen}
        title={"Suche"}
        customSize={["full", "3xl"]}
      >
        <InputGroup>
          <InputLeftElement>
            <FaSearch />
          </InputLeftElement>
          <Input
            placeholder={"Suche"}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </InputGroup>
        <Stack
          w={"100%"}
          roundedTopRight={"xl"}
          roundedBottomRight={"xl"}
          maxH={"100%"}
          overflow={"auto"}
          id={"scrollableDiv"}
        >
          <InfiniteScroll
            next={loadNext}
            hasMore={page < maxPages && posts.length > 0}
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
      </CodeUpModal>
    </>
  );
}
