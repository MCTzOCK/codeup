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

  const [text, setText] = useState<{
    _id: string;
    name: string;
    course: string;
    friendlyName: string;
    content: string;
    quiz: {
      question: string;
      answers: { answer: string; correct: boolean }[];
    }[];
  }>();

  const [video, setVideo] = useState<{
    _id: string;
    name: string;
    course: string;
    friendlyName: string;
    transcript: string;
    youtube: string;
    quiz: {
      question: string;
      answers: { answer: string; correct: boolean }[];
    }[];
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
        if (res.payload.type === "text") {
          setText(res.payload.text);
        } else {
          setVideo(res.payload.video);
        }
      }

      setLoading(false);
    });
  }, [courseQuery, sectionQuery]);

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
      {!loading && !notFound ? (
        <>
          {text ? (
            <>
              <MDRenderer content={text.content} />
            </>
          ) : null}
          {video ? <MDRenderer content={video.transcript} /> : null}
        </>
      ) : null}
    </>
  );
}
