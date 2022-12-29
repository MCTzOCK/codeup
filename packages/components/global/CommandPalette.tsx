/**
 * packages/components/global/CommandPalette.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.12.2022
 *
 */

import * as React from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { FaSearch, FaUser } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import REST from "@codeup/rest/dist";
import { useRouter } from "next/router";
import { FiMessageSquare } from "react-icons/fi";
import { useLoggedIn, useUserInfo } from "@codeup/hooks";

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false);

  const inputRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [value, setValue] = React.useState("");
  const { loggedIn, loaded, userInfo } = useLoggedIn();

  const [results, setResults] = React.useState<
    {
      title: string;
      subtitle?: string;
      icon: any;
      onClick: () => void;
    }[]
  >([]);

  const router = useRouter();

  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      // CTRL + K or CMD + K or CTRL + SHIFT + P or CMD + SHIFT + P
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "k" || e.key === "p") &&
        !open
      ) {
        e.preventDefault();
        setOpen(true);
        inputRef.current.focus();
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

  React.useEffect(() => {
    if (value.length < 3 || !loggedIn) {
      return;
    }

    if (value.startsWith("@")) {
      setResults([
        {
          title: "Zu Benutzer @" + value.substring(1) + " springen",
          icon: <FaUser />,
          onClick: () => {
            router.push("/forum/" + value.substring(1));
            setOpen(false);
          },
        },
        {
          title: "Direktnachricht an @" + value.substring(1) + " senden",
          icon: <FiMessageSquare />,
          onClick: async () => {
            const directMessage = await REST.Forum.createChatV2({
              token: localStorage.getItem("token") as string,
              user: value.substring(1),
            });

            router.push(
              "/forum/messages/?chat=" + directMessage.payload.chat._id
            );
            setOpen(false);
          },
        },
      ]);
    }
  }, [value]);

  return (
    <>
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        height="100vh"
        backgroundColor="rgba(0, 0, 0, 0.5)"
        zIndex="999"
        display={open ? "block" : "none"}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="50%"
          height="50%"
          borderRadius="10px"
          rounded={"xl"}
          backgroundColor={"gray.800"}
          p={"2rem"}
        >
          <InputGroup>
            <InputLeftElement>
              <FaSearch />
            </InputLeftElement>
            <Input
              placeholder={"Suchen oder Befehl eingeben"}
              id={"cmd-p-i"}
              ref={inputRef}
              defaultValue={value}
              onChange={() => {
                setValue(inputRef.current.value);
              }}
            />
            <InputRightElement>
              <Heading
                size={"xl"}
                cursor={"pointer"}
                onClick={() => {
                  setValue("");
                  inputRef.current.value = "";
                }}
              >
                <TiDelete />
              </Heading>
            </InputRightElement>
          </InputGroup>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
            width={"100%"}
            height={"100%"}
            overflow={"auto"}
          >
            {value.length >= 3 && loggedIn ? (
              <>
                {results.map((r, i) => (
                  <Box
                    key={i}
                    display={"flex"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent={"flex-start"}
                    width={"100%"}
                    height={"auto"}
                    cursor={"pointer"}
                    mt={4}
                    onClick={() => {
                      r.onClick();
                    }}
                    _hover={{
                      backgroundColor: "gray.700",
                    }}
                    p={"0.5rem"}
                  >
                    {r.icon}
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      alignItems={"center"}
                      justifyContent={"flex-start"}
                      width={"100%"}
                      height={"auto"}
                    >
                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        alignItems={"center"}
                        justifyContent={"flex-start"}
                        width={"auto"}
                        height={"auto"}
                        mr={"1rem"}
                      >
                        <Box
                          display={"flex"}
                          flexDirection={"column"}
                          alignItems={"flex-start"}
                          justifyContent={"flex-start"}
                          width={"auto"}
                          height={"auto"}
                          ml={"0.5rem"}
                        >
                          <Text fontSize={"xl"}>{r.title}</Text>
                          <Text fontSize={"lg"}>{r.subtitle}</Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </>
            ) : (
              <>
                <Flex
                  w={"100%"}
                  h={"fit-content"}
                  minH={"100%"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  flexDirection={"column"}
                >
                  <Box>
                    {loggedIn ? (
                      <>
                        <Heading size={"lg"}>
                          Suchen oder Befehl eingeben
                        </Heading>
                        <Text mt={8} fontSize={"lg"} fontFamily={"monospace"}>
                          Beispiele:
                        </Text>
                        <UnorderedList fontSize={"lg"} fontFamily={"monospace"}>
                          <ListItem>
                            <code>@ben.sbrt</code> - Optionen für Benutzer
                            anzeigen
                          </ListItem>
                        </UnorderedList>
                      </>
                    ) : (
                      <>
                        <Heading size={"lg"}>Schnellzugriff</Heading>
                        <Text mt={8} fontSize={"lg"} fontFamily={"monospace"}>
                          Bitte melde dich an, um den Schnellzugriff zu nutzen.
                        </Text>
                      </>
                    )}
                  </Box>
                </Flex>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
