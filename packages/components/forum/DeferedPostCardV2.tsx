/**
 * packages/components/forum/DeferedPostCardV2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2022
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { useLoggedIn } from "@codeup/hooks";
import REST from "@codeup/rest";
import PostCardV2 from "./PostCardV2";

export default function DeferedPostCardV2(props: {
  post: {
    parent: string | null;
    _id: string;
    user: string;
    username: string;
    content: string;
    likes: string[];
    createdAt: string;
    __v: 0;
  };
  reloadPosts?: () => void;
}) {
  const [profile, setProfile] = useState<any>(null);

  const { userInfo } = useLoggedIn();

  useEffect(() => {
    REST.Forum.getProfileV2(props.post.username).then((res) => {
      if (res.status === 200) {
        setProfile(res.payload.profile);
      } else {
        setProfile(null);
      }
    });
  }, []);

  return (
    <>
      {props.post && profile && userInfo && props.reloadPosts ? (
        <PostCardV2
          post={props.post}
          profile={profile}
          postOwner={userInfo && userInfo.username === props.post.username}
          reloadPosts={props.reloadPosts}
          userId={userInfo.id}
        />
      ) : null}
    </>
  );
}
