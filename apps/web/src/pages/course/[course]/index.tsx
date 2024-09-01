/**
 * apps/web/src/pages/course/[course]/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.11.2022
 *
 */

import * as React from "react";
import REST from "@codeup/rest";
import {
  useToast,
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  Heading,
  Image,
  Text,
  Grid,
  GridItem,
  Link,
  Input,
  Badge,
  Stack,
  StackDivider,
  Divider,
  Progress,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Head from "next/head";
import AccountManager from "@codeup/util/dist/AccountManager";
import Milestones from "@codeup/components/landingpage/Milestones";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { useEffect, useState } from "react";
import redirect from "@codeup/util/dist/userworkflow/redirect";
import { FaCheck } from "react-icons/fa";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import { translateOnlineV3 } from "../../../global/i18n/onlineTranslateV3";

export default function Index() {
  const [course, setCourse] = React.useState<{
    _id: string;
    name: string;
    friendlyName: string;
    description: string;
    splashImage: string;
    available: boolean;
    contentPositions: string[];
    createdAt: string;
    creator: string;
    __v: number;
  }>();

  const [contents, setContents] = React.useState<
    {
      _id: string;
      displayName: string;
      url: string;
      course: string;
      createdAt: string;
      type: "VIDEO" | "TEXT" | "INTERACTIVE";
      textContent: string;
      quiz: any[];
      videoUrl: string;
    }[]
  >([]);
  const [contentsLoading, setContentsLoading] = React.useState<boolean>(true);
  const [progress, setProgress] = React.useState<string[]>([]);

  const [isEnrolled, setEnrolled] = useState<boolean>(false);

  const router = useRouter();

  const { course: courseName } = router.query;
  const toast = useToast();

  const { t } = useTranslation("courses");

  useEffect(() => {
    redirect({
      forceAnonymous: false,
      allowAnonymous: false,
      redirectToLogin: true,
      redirectTo: "/course/" + courseName,
    });
  });

  React.useEffect(() => {
    if (courseName) {
      REST.Course.getCourse({
        course: courseName as string,
        token: AccountManager.getActiveToken(),
      }).then(async (res) => {
        if (res.status === 200) {
          if (router.locale === "de") {
            setCourse(res.payload.course);
          } else {
            setCourse({
              ...res.payload.course,
              name: await translateOnlineV3({
                to: router.locale as string,
                from: "de",
                text: res.payload.course.name,
              }),
              description: await translateOnlineV3({
                to: router.locale as string,
                from: "de",
                text: res.payload.course.description,
              }),
            });
          }

          let contents0 = [];
          for (const contentId of res.payload.course.contentPositions) {
            const res0 = await REST.Course.getSection({
              course: courseName as string,
              section: contentId,
              token: AccountManager.getActiveToken(),
            });

            if (res0.status === 200) {
              if (router.locale === "de") {
                contents0.push(res0.payload.content);
              } else {
                contents0.push({
                  ...res0.payload.content,
                  displayName: await translateOnlineV3({
                    to: router.locale as string,
                    from: "de",
                    text: res0.payload.content.displayName,
                  }),
                });
              }
            }
          }

          setContents(contents0);
          setContentsLoading(false);
        } else {
          toast({
            title: t("base:control.error"),
            description: t("course.loading.error"),
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      });

      REST.Course.getEnrollment({
        token: AccountManager.getActiveToken(),
        course: courseName as string,
      }).then(async (res) => {
        let enrolled = res.payload.enrolled ? true : false;
        setEnrolled(enrolled);

        if (enrolled) {
          const rx = await REST.Course.getCourseProgress({
            token: AccountManager.getActiveToken(),
            course: courseName as string,
          });

          if (rx.status === 200) {
            setProgress(rx.payload.progress);
          }
        }
      });
    }
  }, [courseName]);

  return (
    <>
      <Head>
        <title>{course ? course.name : t("course.overview")} - CodeUp</title>
      </Head>
      {course ? (
        <>
          <Flex
            direction={"column"}
            pt={"2rem"}
            alignItems={"center"}
            w={"100%"}
            minH={"100vh"}
            h={"fit-content"}
            bg={"#000"}
          >
            <Box
              w={["100%", "75%"]}
              backgroundColor={"black"}
              p={4}
              rounded={"xl"}
              boxShadow={"xl"}
            >
              <CHeading size={"2xl"}>
                {course.name}
                <chakra.sub pl={4} fontSize={"2xl"}>
                  {t("course.by")} @{course.creator}
                </chakra.sub>
              </CHeading>
              <Flex
                direction={{
                  base: "column",
                  sm: "column",
                  md: "row",
                  lg: "row",
                  xl: "row",
                }}
                w={"100%"}
                mt={6}
              >
                <Box flex={"100%"}>
                  <Image
                    src={course.splashImage}
                    alt={course.name}
                    w={["100%", "75%"]}
                    maxH={"300px"}
                    objectFit="cover"
                    borderRadius="lg"
                  />
                  <Text mt={4} fontSize={"lg"}>
                    <CHeading size={"lg"}>{t("description")}</CHeading>
                    {course.description}
                  </Text>
                  <Text mt={4} fontSize={"lg"}>
                    <CHeading size={"lg"}>{t("status")}</CHeading>
                    {isEnrolled ? (
                      <>
                        <Badge colorScheme="green">{t("enrolled")}</Badge>
                        <br />
                        {t("enrolled.text")}
                      </>
                    ) : (
                      <>
                        <Badge colorScheme="red">{t("not.enrolled")}</Badge>
                        <br />
                        {t("not.enrolled.text")}
                        <br />
                        <Button
                          variant={"brand"}
                          mt={2}
                          onClick={async () => {
                            await REST.Course.changeEnrollment({
                              token: AccountManager.getActiveToken(),
                              course: courseName as string,
                            });

                            setEnrolled(true);
                          }}
                        >
                          {t("enroll")}
                        </Button>
                      </>
                    )}
                  </Text>
                  {isEnrolled && (
                    <>
                      <Text mt={4} fontSize={"lg"}>
                        <CHeading size={"lg"}>{t("progress")}</CHeading>
                        <br />
                        <Progress
                          value={progress.length}
                          max={contents.length}
                          variant={"brand"}
                          rounded={"md"}
                        />
                      </Text>
                    </>
                  )}
                </Box>
                <Box flex={"100%"}>
                  <Milestones
                    milestones={contents.map((content) => {
                      return {
                        title: content.displayName,
                        lwdIcon: progress.includes(content._id) ? (
                          <FaCheck />
                        ) : null,
                        date: new Date(content.createdAt).toLocaleDateString(),
                        description:
                          content.type === "INTERACTIVE"
                            ? ""
                            : t("section.quiz.questions").replace(
                                "{0}",
                                content.quiz.length.toString()
                              ),
                        cursor: "pointer",
                        onClick: () => {
                          router.push(
                            "/course/" + course.friendlyName + "/" + content._id
                          );
                        },
                      };
                    })}
                    title={t("sections")}
                  />
                  {contentsLoading && (
                    <>
                      <AuthenticateLoadingIndicator
                        text={t("loading.contents")}
                      />
                    </>
                  )}
                </Box>
              </Flex>
            </Box>
          </Flex>
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
