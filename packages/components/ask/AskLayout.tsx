/**
 * packages/components/ask/AskLayout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.06.23
 *
 */
import { Flex, IconButton, Stack, useDisclosure } from "@chakra-ui/react";
import { FaHome, FaPlus, FaSearch } from "react-icons/fa";
import PopupManager from "@codeup/web/src/global/PopupManager";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { AiFillMessage } from "react-icons/ai";
import React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { useRouter } from "next/router";
import FTSPopup from "./FTSPopup";

export default function AskLayout(props: { children: React.ReactNode }) {
  const { loggedIn, userInfo } = useLoggedIn();
  const router = useRouter();

  const {
    isOpen: isFTSOpen,
    onOpen: onFTSOpen,
    onClose: onFTSClose,
  } = useDisclosure();

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
              onClick={() => {
                router.push("/ask");
              }}
            />
            <IconButton
              aria-label={""}
              variant="ghost"
              size={"lg"}
              fontSize={"2xl"}
              p={"2rem"}
              icon={<FaPlus />}
              rounded={"none"}
              onClick={async () => {
                if (!loggedIn) {
                  window.dispatchEvent(new CustomEvent("codeup::open_login"));
                  return;
                }

                const content = await PopupManager.promptAsync({
                  title: "Neuer Post",
                  helperText: "Was möchtest du posten?",
                  inputType: "TEXTAREA",
                });

                if (!content) return;

                const res = await REST.Ask.createPost(
                  content,
                  AccountManager.getActiveToken()
                );

                PopupManager.alertAsync({
                  title: "Erfolgreich",
                  description: "Dein Post wurde erfolgreich erstellt.",
                });
              }}
            />
            <IconButton
              aria-label={""}
              variant="ghost"
              size={"lg"}
              fontSize={"2xl"}
              p={"2rem"}
              icon={<FaSearch />}
              rounded={"none"}
              onClick={() => {
                onFTSOpen();
              }}
            />
            <IconButton
              aria-label={""}
              variant="ghost"
              size={"lg"}
              fontSize={"2xl"}
              p={"2rem"}
              icon={<AiFillMessage />}
              rounded={"none"}
              onClick={async () => {
                if (!loggedIn) {
                  window.dispatchEvent(new CustomEvent("codeup::open_login"));
                  return;
                }
                router.push("/ask/direct");
              }}
            />
          </Stack>
        </Flex>
        {props.children}
      </Flex>
      <FTSPopup isOpen={isFTSOpen} onOpen={onFTSOpen} onClose={onFTSClose} />
    </>
  );
}
