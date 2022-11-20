/**
 * apps/web/src/pages/course/[course]/[section].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.11.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Flex,
  Heading,
  Link,
  ListItem,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import ErrorComponent from "@codeup/components/global/ErrorComponent";
import REST from "@codeup/rest";
import ReactMarkdown from "react-markdown";
import CodeBlock from "../../../special-components/CodeBlock";
import MDRenderer from "../../../special-components/MDRenderer";
import VideoPlayer from "@codeup/components/global/VideoPlayer";

export default function SectionViewer() {
  const router = useRouter();

  const [courseQuery, setCourseQuery] = useState<string>("");
  const [sectionQuery, setSectionQuery] = useState<string>("");

  useEffect(() => {
    if (router.query.course) {
      setCourseQuery(router.query.course as string);
    }
    if (router.query.section) {
      setSectionQuery(router.query.section as string);
    }
  }, [router.query.course, router.query.section]);

  const [loading, setLoading] = useState<boolean>(true);

  const [notFound, setNotFound] = useState<boolean>(false);
  const [content, setContent] = useState<{
    _id: string;
    displayName: string;
    course: string;
    url: string;
    type: "TEXT" | "VIDEO";
    textContent: string;
    quiz: {
      question: string;
      answers: {
        answer: string;
        correct: boolean;
      }[];
    }[];
    creator: string;
    createdAt: string;
    __v: number;
  }>();

  useEffect(() => {
    if (courseQuery === "" || sectionQuery === "") return;
    REST.Course.getSection({
      course: courseQuery,
      section: sectionQuery,
    }).then((res) => {
      if (res.status !== 200) {
        setNotFound(true);
      } else {
        setContent(res.payload.content);
      }

      setLoading(false);
    });
  }, [courseQuery, sectionQuery]);

  const [imgId, setImgId] = useState(Math.floor(Math.random() * 12) + 1);

  useEffect(() => {
    // router.reload on key ENTER press
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "r") {
        setImgId(Math.floor(Math.random() * 12) + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {loading ? (
        <>
          <Flex
            w={"100%"}
            h={"100vh"}
            justifyContent={"center"}
            alignItems={"center"}
            direction={"column"}
          >
            <CircularProgress size={"80px"} isIndeterminate color="blue.300" />
            <Heading size={"lg"} mt={4}>
              Lade Inhalte...
            </Heading>
          </Flex>
        </>
      ) : null}
      {notFound ? (
        <>
          <ErrorComponent
            description={"Die angeforderte Seite konnte nicht gefunden werden!"}
            title={"Inhalte konnten nicht geladen werden!"}
          />
        </>
      ) : null}
      {!loading && !notFound && content ? (
        <>
          <Box
            w={"100%"}
            minH={"100vh"}
            h={"fit-content"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            bgPosition={"center"}
            bgRepeat={"no-repeat"}
            bgSize={"cover"}
            bgImage={`url(/_static/images/courses/desk_backgrounds/${imgId}.jpg)`}
          >
            <Box
              w={"100%"}
              mt={8}
              mb={8}
              maxW={["100%", "40%"]}
              h={"fit-content"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              p={4}
              bg={"#000000"}
              borderRadius={"md"}
              boxShadow={"2xl"}
            >
              <Heading size={"lg"} textAlign={"center"} mb={6}>
                {content.displayName}
              </Heading>
              {content.type === "VIDEO" && (
                <>
                  <VideoPlayer
                    url={
                      // @ts-ignore
                      content.videoUrl
                    }
                  />
                </>
              )}
              {/* <MDRenderer content={content.textContent} /> */}
              <iframe
                src={
                  "/api/course/" +
                  courseQuery +
                  "/" +
                  sectionQuery +
                  "?raw=true"
                }
                style={{
                  width: "100%",
                  minHeight: "100vh",
                  height: "fit-content",
                  border: "none",
                }}
              />
            </Box>
          </Box>
        </>
      ) : null}
    </>
  );
}
