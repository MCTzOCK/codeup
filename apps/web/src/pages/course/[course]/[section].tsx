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
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Flex,
  Heading,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import ErrorComponent from "@codeup/components/global/ErrorComponent";
import REST from "@codeup/rest";
import VideoPlayer from "@codeup/components/global/VideoPlayer";
import { Quiz } from "@codeup/components/course";
import Head from "next/head";
import AccountManager from "@codeup/util/dist/AccountManager";
import { FaBackward, FaForward } from "react-icons/fa";
import PopupManager from "../../../global/PopupManager";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import { translateOnlineV3 } from "../../../global/i18n/onlineTranslateV3";
import Highlight from "react-highlight";
import "highlight.js/styles/base16/3024.min.css";

export default function SectionViewer() {
  const router = useRouter();

  const { t } = useTranslation("courses");

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
    type: "TEXT" | "VIDEO" | "INTERACTIVE";
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
  const [intro, setIntro] = React.useState<string>("");
  const [iSteps, setISteps] = React.useState<
    {
      text: string;
      code: string;
      language: string;
      correct: string;
      task: string;
    }[]
  >([]);

  const [contentPositions, setContentPositions] = useState<string[]>([]);

  useEffect(() => {
    if (courseQuery === "" || sectionQuery === "") return;
    REST.Course.getSection({
      course: courseQuery,
      section: sectionQuery,
      token: AccountManager.getActiveToken(),
    }).then(async (res) => {
      if (res.status !== 200) {
        setNotFound(true);
      } else {
        if (res.payload.content.type === "INTERACTIVE") {
          const p = JSON.parse(res.payload.content.textContent);
          setISteps(p.steps);
          setIntro(p.intro);
        }
        if (router.locale === "de") {
          setContent(res.payload.content);
        } else {
          let quiz: any[] = [];

          for await (const q of res.payload.content.quiz) {
            quiz.push({
              ...q,
              question: await translateOnlineV3({
                to: router.locale as string,
                from: "de",
                text: q.question,
              }),
              answers: await Promise.all(
                q.answers.map(async (a: any) => {
                  return {
                    ...a,
                    answer: await translateOnlineV3({
                      to: router.locale as string,
                      from: "de",
                      text: a.answer,
                    }),
                  };
                })
              ),
            });
          }

          setContent({
            ...res.payload.content,
            displayName: await translateOnlineV3({
              to: router.locale as string,
              from: "de",
              text: res.payload.content.displayName,
            }),
            textContent: await translateOnlineV3({
              to: router.locale as string,
              from: "de",
              text: res.payload.content.textContent,
            }),
            quiz: quiz,
          });
        }
        REST.Course.getCourse({
          course: courseQuery,
          token: AccountManager.getActiveToken(),
        }).then((res0) => {
          if (res0.status === 200) {
            setContentPositions(res0.payload.course.contentPositions);
          } else {
            setNotFound(true);
          }
          setLoading(false);
        });
      }
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
      <Head>
        <title>{content ? content.displayName : t("content")} - CodeUp</title>
      </Head>
      {loading ? (
        <>
          <Flex
            w={"100%"}
            h={"100vh"}
            justifyContent={"center"}
            alignItems={"center"}
            direction={"column"}
            bg={"#000"}
          >
            <CircularProgress size={"80px"} isIndeterminate color="brand.500" />
            <Heading size={"lg"} mt={4}>
              {t("loading.content")}
            </Heading>
          </Flex>
        </>
      ) : null}
      {notFound ? (
        <>
          <ErrorComponent
            description={t("error.404")}
            title={t("error.404.title")}
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
              {content.type !== "INTERACTIVE" ? (
                <>
                  {
                    // @ts-ignore
                    content.videoUrl !== "" && (
                      <>
                        <VideoPlayer
                          url={
                            // @ts-ignore
                            content.videoUrl
                          }
                        />
                      </>
                    )
                  }
                  {/* <MDRenderer content={content.textContent} /> */}
                  {content.textContent &&
                  content.textContent !== "__codeup.__no_text_content" ? (
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
                        minHeight: "50vh",
                        height: "fit-content",
                        border: "none",
                        maxWidth: "100%",
                      }}
                      onLoad={(e) => {
                        const iframe = e.target as HTMLIFrameElement;

                        if (iframe && iframe.contentDocument) {
                          iframe.contentDocument.body.style.maxWidth = "100%";
                          iframe.contentDocument.body.style.overflowX =
                            "hidden";
                          iframe.contentDocument.body.style.margin = "0";
                          iframe.contentDocument.body.style.padding = "0";
                        }
                      }}
                    />
                  ) : null}
                  {content.quiz && content.quiz.length > 0 && (
                    <Quiz
                      title={content.displayName}
                      questions={content.quiz}
                      successCB={async () => {
                        await REST.Course.updateCourseProgress({
                          course: courseQuery,
                          section: sectionQuery,
                          token: AccountManager.getActiveToken(),
                        });
                        PopupManager.alertAsync({
                          title: t("finished"),
                          description: t("finished.section"),
                        });
                      }}
                    />
                  )}
                </>
              ) : (
                <>
                  <Stack spacing={4}>
                    <Flex
                      gap={2}
                      direction={{
                        base: "column",
                        sm: "column",
                        md: "row",
                        lg: "row",
                        xl: "row",
                      }}
                    >
                      <Box flex={"100%"}>
                        <Text fontSize={"lg"} mt={2}>
                          {intro}
                        </Text>
                      </Box>
                      <Box flex={"100%"}></Box>
                    </Flex>
                    {iSteps.map((step, index) => {
                      return (
                        <>
                          <Flex
                            gap={6}
                            direction={{
                              base: "column",
                              sm: "column",
                              md: "row",
                              lg: "row",
                              xl: "row",
                            }}
                          >
                            <Box flex={"100%"}>
                              <Text fontSize={"lg"} mt={2}>
                                {step.text}
                                <br />
                                <Highlight
                                  className={step.language + " code-block-cup"}
                                >
                                  {step.code}
                                </Highlight>
                                <br />
                                {step.task}
                              </Text>
                              <Textarea
                                mt={4}
                                placeholder={t("your.answer")}
                                id={"step-" + index + "-answer"}
                                bg={"gray.600"}
                                fontSize={"xl"}
                              />
                              <Flex gap={4} direction={"row"}>
                                <Button
                                  mt={4}
                                  variant={"brand"}
                                  onClick={() => {
                                    const text = (
                                      document.getElementById(
                                        "step-" + index + "-answer"
                                      ) as HTMLInputElement
                                    ).value;

                                    if (text === step.correct) {
                                      PopupManager.alertAsync({
                                        title: t("correct"),
                                        description: t("correct.description"),
                                      });
                                    } else {
                                      PopupManager.alertAsync({
                                        title: t("wrong"),
                                        description: t("wrong.description"),
                                      });
                                    }
                                  }}
                                >
                                  {t("check")}
                                </Button>
                                <Button
                                  mt={4}
                                  variant={"brand"}
                                  onClick={() => {
                                    (
                                      document.getElementById(
                                        "step-" + index + "-answer"
                                      ) as HTMLInputElement
                                    ).value = step.correct;
                                  }}
                                >
                                  {t("solve")}
                                </Button>
                              </Flex>
                            </Box>
                          </Flex>
                        </>
                      );
                    })}
                  </Stack>
                </>
              )}
              <ButtonGroup w={"100%"} mt={"2rem"}>
                <Button
                  w={"100%"}
                  variant={"brand"}
                  leftIcon={<FaBackward />}
                  onClick={() => {
                    router.push(
                      "/course/" +
                        courseQuery +
                        "/" +
                        contentPositions[
                          contentPositions.indexOf(sectionQuery) - 1
                        ]
                    );
                  }}
                  disabled={contentPositions.indexOf(content._id) === 0}
                >
                  {t("back")}
                </Button>
                <Button
                  w={"100%"}
                  variant={"brand"}
                  rightIcon={<FaForward />}
                  onClick={() => {
                    router.push(
                      "/course/" +
                        courseQuery +
                        "/" +
                        contentPositions[
                          contentPositions.indexOf(sectionQuery) + 1
                        ]
                    );
                  }}
                  disabled={
                    contentPositions.indexOf(content._id) ===
                    contentPositions.length - 1
                  }
                >
                  {t("next")}
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
        </>
      ) : null}
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["courses"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
