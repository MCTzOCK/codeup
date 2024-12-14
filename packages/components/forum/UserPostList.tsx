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
import { Button, CircularProgress, Flex, HStack } from "@chakra-ui/react";
import PostCardV2 from "./PostCardV2";
import { FaFile, FaImage, FaPen, FaPlus, FaVideo } from "react-icons/fa";
import { useTranslation } from "next-i18next";
import StackedMenu from "../menu/StackedMenu";
import StackedMenuItem from "../menu/StackedMenuItem";
import PopupManager from "@codeup/web/src/global/PopupManager";
import AccountManager from "@codeup/util/dist/AccountManager";

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

  const { t } = useTranslation();

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

  function upload(options: {
    prefix: string;
    mimeType: string;
    fileNameAsSuffix: boolean;
  }) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/media/upload";
    const a = document.createElement("input");
    a.type = "file";
    a.accept = options.mimeType;
    a.name = "file";

    form.appendChild(a);

    a.click();

    a.onchange = async () => {
      const formData = new FormData(form);

      let file = a.files![0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const res = await REST.UserContent.upload(
          file.name,
          (reader.result as string).split(",")[1]
        );

        const r0 = await REST.Forum.createPostV2({
          token: localStorage.getItem("token") as string,
          content: res.payload.url,
        });

        if (r0.status === 200) {
          reload();
        }
      };
    };
  }

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
      {props.loggedInUser.username === props.username && (
        <>
          <HStack p={4}>
            <StackedMenu
              trigger={
                <Button variant={"brand"} leftIcon={<FaPlus />}>
                  {t("forum:post.new")}
                </Button>
              }
              maxWidth={"250px"}
            >
              <StackedMenuItem
                title={t("forum:post.text")}
                description={t("forum:post.text.description")}
                icon={<FaPen size={"24"} />}
                onClick={async () => {
                  const text = await PopupManager.promptAsync({
                    title: t("forum:post.text"),
                    inputType: "INPUT",
                    helperText: t("forum:post.text.helper"),
                  });

                  if (!text) {
                    return;
                  }

                  const res = await REST.Forum.createPostV2({
                    token: AccountManager.getActiveToken(),
                    content: text,
                  });

                  if (res.status === 200) {
                    await reload();
                  }
                }}
              />
              <StackedMenuItem
                title={t("forum:post.media.image")}
                description={t("forum:post.media.image.description")}
                icon={<FaImage size={"24"} />}
                onClick={() => {
                  upload({
                    fileNameAsSuffix: false,
                    mimeType: "image/*",
                    prefix: "image",
                  });
                }}
              />
              <StackedMenuItem
                title={t("forum:post.media.video")}
                description={t("forum:post.media.video.description")}
                icon={<FaVideo size={"24"} />}
                onClick={() => {
                  upload({
                    fileNameAsSuffix: false,
                    mimeType: "video/*",
                    prefix: "video",
                  });
                }}
              />
              <StackedMenuItem
                title={t("forum:post.media.file")}
                description={t("forum:post.media.file.description")}
                icon={<FaFile size={"24"} />}
                onClick={() => {
                  upload({
                    fileNameAsSuffix: false,
                    mimeType: "*",
                    prefix: "file",
                  });
                }}
              />
            </StackedMenu>
          </HStack>
        </>
      )}
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
