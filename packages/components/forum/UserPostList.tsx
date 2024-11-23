/**
 * packages/components/forum/UserPostList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.11.2024
 *
 */

import * as React from "react";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import { CircularProgress, Flex } from "@chakra-ui/react";
import PostCardV2 from "./PostCardV2";

export default function UserPostList(props: {
  username: string;
  loggedInUser: any;
  displayName: string;
}) {
  const [posts, setPosts] = React.useState<
    {
      parent: string | null;
      _id: string;
      user: string;
      username: string;
      content: string;
      likes: string[];
      createdAt: string;
      __v: 0;
    }[]
  >([]);

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    if (!props.username) return;

    reload();
  }, [props.username]);

  const reload = async () => {
    const res = await REST.Forum.getProfilePostsV2({
      username: props.username,
    });

    if (res.status === 200) {
      setPosts(res.payload.posts);
    } else {
      setError(res.payload.error);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <>
        <Flex justifyContent={"center"} alignItems={"center"} w={"100%"} mt={4}>
          <CircularProgress isIndeterminate color={"brand.500"} size={64} />
        </Flex>
      </>
    );
  }

  return (
    <>
      {posts.map((post, index) => (
        <PostCardV2
          post={post}
          postOwner={post.username === props.loggedInUser.username}
          reloadPosts={reload}
          userId={props.loggedInUser._id}
          profile={{
            username: post.username,
            displayName: props.displayName,
            verified: post.username === "ben.sbrt",
          }}
        />
      ))}
    </>
  );
}
