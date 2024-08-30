/**
 * apps/web/src/pages/creator/studio/create/content/[course].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.08.2024
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { sProp } from "../../../../../global/i18nstaticProps";
import Head from "next/head";
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import CreatorStudioLayout from "@codeup/components/dist/creator/studio/CreatorStudioLayout";
import ErrorComponent from "@codeup/components/global/ErrorComponent";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { FaVideo } from "react-icons/fa";
import { FaComputerMouse } from "react-icons/fa6";
import PopupManager from "../../../../../global/PopupManager";
import AdminQuizMaker from "@codeup/components/dist/admin/AdminQuizMaker";

export default function ContentCreator() {
  const router = useRouter();
  const { t } = useTranslation("creator-studio");
  const [error, setError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [course, setCourse] = React.useState<string>("");
  const [step, setStep] = React.useState<number>(0);
  const [type, setType] = React.useState<"VIDEO" | "INTERACTIVE">("VIDEO");
  const [displayName, setDisplayName] = React.useState<string>("");
  const [url, setUrl] = React.useState<string>("");
  const [videoUrl, setVideoUrl] = React.useState<string>("");
  const [quizQuestions, setQuizQuestions] = React.useState<
    {
      question: string;
      answers: {
        answer: string;
        correct: boolean;
      }[];
    }[]
  >([]);
  const [intro, setIntro] = React.useState<string>("");

  useEffect(() => {
    if (!router || !router.query || !router.query.course) return;

    fetchCourse();
  }, [router, router.query, router.query.course]);

  const fetchCourse = async () => {
    const res = await REST.Creator.getCourses(AccountManager.getActiveToken());
    if (res.status !== 200) {
      setError(true);
      setLoading(false);
      return;
    }

    if (
      res.payload.courses.find(
        (c: { _id: string }) => c._id === router.query.course
      )
    ) {
      setCourse(router.query.course as string);
      setLoading(false);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      <CreatorStudioLayout>
        <Box textAlign={"center"} pt={6}>
          <CHeading size={"xl"}>{t("create.content")}</CHeading>
        </Box>
        {!loading && !error && (
          <>
            <Flex
              justifyContent={"center"}
              w={"100%"}
              minH={"70vh"}
              h={"fit-content"}
              p={8}
            >
              {step === 0 && (
                <>
                  <Box
                    minW={{
                      base: "100%",
                      md: "50%",
                    }}
                    h={"fit-content"}
                    bg={"gray.800"}
                    rounded={"md"}
                    p={4}
                  >
                    <CHeading size={"lg"}>{t("section.type")}</CHeading>
                    <Text>{t("section.choose.type")}</Text>
                    <Grid
                      templateColumns={"repeat(auto-fit, minmax(300px, 1fr));"}
                      gap={4}
                      p={4}
                    >
                      {(
                        [
                          {
                            name: t("section.type.video"),
                            description: t("section.type.video.description"),
                            icon: <FaVideo />,
                            type: "VIDEO",
                          },
                          {
                            name: t("section.type.interactive"),
                            description: t(
                              "section.type.interactive.description"
                            ),
                            icon: <FaComputerMouse />,
                            type: "INTERACTIVE",
                          },
                        ] as {
                          name: string;
                          description: string;
                          type: "VIDEO" | "INTERACTIVE";
                          icon: any;
                        }[]
                      ).map((s) => (
                        <>
                          <Box
                            bg={"#000"}
                            rounded={"xl"}
                            cursor={"pointer"}
                            _hover={{
                              outline: "1px solid #F7DE1F",
                            }}
                            p={4}
                            onClick={async () => {
                              setType(s.type);
                              setStep(1);
                            }}
                          >
                            <Flex
                              fontSize={"4xl"}
                              w={"100%"}
                              justifyContent={"center"}
                              color={"white"}
                              align={"center"}
                            >
                              {s.icon}
                            </Flex>
                            <Box mt={2} textAlign={"center"}>
                              <CHeading size={"md"}>{s.name}</CHeading>
                            </Box>
                            <Text
                              fontSize={"sm"}
                              color={"white"}
                              textAlign={"center"}
                              mt={2}
                            >
                              {s.description}
                            </Text>
                          </Box>
                        </>
                      ))}
                    </Grid>
                  </Box>
                </>
              )}
              {step === 1 && (
                <>
                  <Box
                    minW={{
                      base: "100%",
                      md: "50%",
                    }}
                    h={"fit-content"}
                    bg={"gray.800"}
                    rounded={"md"}
                    p={4}
                  >
                    <CHeading size={"lg"}>
                      {t("section.create.metadata")}
                    </CHeading>
                    <FormControl isRequired mt={4}>
                      <FormLabel>{t("name")}</FormLabel>
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder={t("name")}
                      />
                    </FormControl>
                    <FormControl isRequired mt={4}>
                      <FormLabel>{t("name.url.friendly")}</FormLabel>
                      <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={t("name.url.friendly")}
                      />
                    </FormControl>
                    <Button
                      variant={"brand"}
                      mt={4}
                      onClick={async () => {
                        if (type === "VIDEO") {
                          setStep(2);
                        } else {
                          setStep(102);
                        }
                      }}
                      disabled={url.length < 3 || displayName.length < 3}
                    >
                      {t("next")}
                    </Button>
                  </Box>
                </>
              )}
              {step === 2 && (
                <>
                  <Box
                    minW={{
                      base: "100%",
                      md: "50%",
                    }}
                    h={"fit-content"}
                    bg={"gray.800"}
                    rounded={"md"}
                    p={4}
                  >
                    <CHeading size={"lg"}>{t("section.create.video")}</CHeading>
                    <FormControl isRequired mt={4}>
                      <FormLabel>{t("video.url")}</FormLabel>
                      <Input
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder={t("video.url")}
                      />
                    </FormControl>
                    <Button
                      variant={"brand"}
                      mt={4}
                      onClick={async () => {
                        setStep(3);
                      }}
                      disabled={url.length < 1}
                    >
                      {t("next")}
                    </Button>
                  </Box>
                </>
              )}
              {step === 3 && (
                <>
                  <Box
                    minW={{
                      base: "100%",
                      md: "50%",
                    }}
                    h={"fit-content"}
                    bg={"gray.800"}
                    rounded={"md"}
                    p={4}
                  >
                    <CHeading size={"lg"}>{t("section.create.quiz")}</CHeading>
                    <AdminQuizMaker
                      quizQuestions={quizQuestions}
                      setQuizQuestions={setQuizQuestions}
                    />
                    <Button
                      variant={"brand"}
                      mt={4}
                      onClick={async () => {
                        const res = await REST.Creator.createContent({
                          token: AccountManager.getActiveToken(),
                          course: course,
                          displayName: displayName,
                          url: url,
                          type: "VIDEO",
                          videoUrl: videoUrl,
                          quiz: quizQuestions,
                          textContent: "__codeup.__no_text_content",
                        });

                        if (res.status === 200) {
                          router.push(
                            "/creator/studio/edit/" + res.payload.content._id
                          );
                        }
                      }}
                    >
                      {t("create")}
                    </Button>
                  </Box>
                </>
              )}
              {step === 102 && (
                <>
                  <Box
                    minW={{
                      base: "100%",
                      md: "50%",
                    }}
                    h={"fit-content"}
                    bg={"gray.800"}
                    rounded={"md"}
                    p={4}
                  >
                    <CHeading size={"lg"}>
                      {t("section.create.interactive")}
                    </CHeading>
                    <FormControl isRequired mt={4}>
                      <FormLabel>{t("intro")}</FormLabel>
                      <Textarea
                        value={intro}
                        onChange={(e) => setIntro(e.target.value)}
                        placeholder={t("intro")}
                      />
                    </FormControl>
                  </Box>
                </>
              )}
            </Flex>
          </>
        )}
        {loading && (
          <Flex
            w={"100%"}
            h={"100vh"}
            justifyContent={"center"}
            alignItems={"center"}
            direction={"column"}
          >
            <CircularProgress size={"80px"} isIndeterminate color="brand.500" />
            <Heading size={"lg"} mt={4}>
              {t("loading.course")}
            </Heading>
          </Flex>
        )}
        {error && (
          <ErrorComponent description={t("loading.course.error")} hideButton />
        )}
      </CreatorStudioLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["creator-studio"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
