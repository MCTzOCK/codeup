/**
 * src/pages/community/search.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.06.2022
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import { PostCard } from "@codeup/components/community/post";

export default function Search() {
  const [term, setTerm] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("term")) {
      setTerm(
        new URLSearchParams(window.location.search).get("term") as string
      );
    }
  }, []);

  const router = useRouter();

  const [results, setResults] = useState<{ posts: []; profiles: [] }>({
    posts: [],
    profiles: [],
  });
  const toast = useToast();

  useEffect(() => {
    if (term.length > 2) {
      fetch(`/api/community/search?term=${term}`)
        .then((res) => res.json())
        // @ts-ignore
        .then((res) => setResults({ posts: res.posts, profiles: res.profiles }))
        .catch((err) => {
          toast({
            title: "Fehler",
            description: "Etwas ist schief gelaufen.",
            status: "error",
            duration: 6000,
          });
        });
    }
  }, [term, toast]);

  return (
    <>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        w={"100%"}
        mt={"2rem"}
      >
        <InputGroup maxW={["100%", "75%"]}>
          <Input
            onChange={(e) => {
              router.push(`/community/search?term=${e.target.value}`);
              setTerm(e.target.value);
            }}
            type={"text"}
            defaultValue={term}
            placeholder={"Suchen..."}
          />
          <InputRightAddon cursor={"pointer"} onClick={() => {}}>
            <FaSearch />
          </InputRightAddon>
        </InputGroup>
      </Flex>
      {(term.length > 2 && results.posts.length > 0) ||
      results.profiles.length > 0 ? (
        <Flex w={"100%"} direction={["column", "row"]} gap={"2rem"} p={"2rem"}>
          <Box flex={"100%"} mt={"2rem"}>
            <Heading textAlign={"center"}>Beiträge</Heading>
            {
              // @ts-ignore
              results.posts
                ? results.posts.map((post: any) => {
                    return (
                      <>
                        <Box
                          cursor="pointer"
                          onClick={() => {
                            router.push("/community/post/" + post._id);
                          }}
                        >
                          <PostCard id={post._id} />
                        </Box>
                      </>
                    );
                  })
                : null
            }
          </Box>
          <Box flex={"100%"} mt={"2rem"}>
            <Heading textAlign={"center"}>Profile</Heading>
            {
              // @ts-ignore
              results.profiles
                ? results.profiles.map((profile: any) => {
                    return (
                      <>
                        <Flex
                          direction={"row"}
                          mb={"1.2rem"}
                          cursor={"pointer"}
                          onClick={() => {
                            router.push(
                              "/community/profile/" + profile.username
                            );
                          }}
                        >
                          <Avatar
                            src={profile.profilePicture}
                            size={"lg"}
                            borderColor={"#FFF"}
                            borderWidth={"2px"}
                          />
                          <Flex direction={"column"} ml={"1.2rem"}>
                            <Heading as={"h1"} fontSize={["2xl", "3xl"]}>
                              {profile.displayName}
                            </Heading>
                            <Text color={"gray.500"}>@{profile.username}</Text>
                          </Flex>
                        </Flex>
                        <Divider />
                      </>
                    );
                  })
                : null
            }
          </Box>
        </Flex>
      ) : null}
    </>
  );
}
