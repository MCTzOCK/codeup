/**
 * apps/web/src/pages/creator/studio/create/content/[course].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.11.2022
 *
 */

import REST from "@codeup/rest";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaBookOpen, FaGlobe } from "react-icons/fa";
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  useToast,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import AdminQuizMaker from "@codeup/components/admin/AdminQuizMaker";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import CreatorStudioLayout from "@codeup/components/creator/studio/CreatorStudioLayout";
import ErrorComponent from "@codeup/components/global/ErrorComponent";
import Builder from "../../../../../special-components/Builder";
import Head from "next/head";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function NewContents() {
  const router = useRouter();
  const { t } = useTranslation("creator-studio");

  const [displayName, setDisplayName] = React.useState("");
  const [course, setCourse] = React.useState("");
  const [url, setURL] = React.useState("");
  const [textContent, setTextContent] = React.useState("");
  const [videoURL, setVideoURL] = React.useState("");
  const [type, setType] = React.useState("VIDEO");
  const [quizQuestions, setQuizQuestions] = React.useState<
    {
      question: string;
      answers: {
        answer: string;
        correct: boolean;
      }[];
    }[]
  >([]);

  const [steps, setSteps] = useState([
    { label: t("name") },
    //{ label: t("content") },
    { label: t("quiz") },
    { label: t("video") },
  ]);

  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const toast = useToast();

  const [custom_event_id, setCustomEventId] = React.useState<string>("");

  useEffect(() => {
    if (router.query.course) {
      REST.Creator.getCourses(localStorage.getItem("token") as string).then(
        (res) => {
          if (res.status === 200) {
            if (
              res.payload.courses.find(
                (c: { _id: string }) => c._id === router.query.course
              )
            ) {
              setCourse(router.query.course as string);
              setCustomEventId(randomString());
              setLoaded(true);
            } else {
              setError(true);
            }
          }
        }
      );
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      <CreatorStudioLayout>
        <Box textAlign={"center"} pt={6}>
          <CHeading size={"xl"}>{t("create.content")}</CHeading>
        </Box>
        <>
          {loaded && !error ? (
            <>
              <Flex flexDir="column" width="100%" p={"5rem"}>
                <Steps
                  size={"lg"}
                  activeStep={activeStep}
                  colorScheme={"brand"}
                >
                  {steps.map(({ label }, index) => (
                    <Step label={label} key={label} mb={"2rem"}>
                      {index === 0 ? (
                        <>
                          <FormControl isRequired>
                            <FormLabel>{t("course.type")}</FormLabel>
                            <Select
                              placeholder={t("course.type")}
                              onChange={(e) => setType(e.target.value)}
                            >
                              <option value={"VIDEO"}>
                                {t("course.type.video")}
                              </option>
                              <option value={"INTERACTIVE"}>
                                {t("course.type.interactive")}
                              </option>
                            </Select>
                          </FormControl>
                          <FormControl mt={"2rem"} isRequired>
                            <FormLabel>{t("title")}</FormLabel>
                            <InputGroup>
                              <InputLeftAddon>
                                <FaBookOpen />
                              </InputLeftAddon>
                              <Input
                                type={"text"}
                                name={"title"}
                                id={"new_content_title"}
                                placeholder={t("title")}
                                required
                                onChange={(e) => setDisplayName(e.target.value)}
                              />
                            </InputGroup>
                          </FormControl>
                          <FormControl mt={"2rem"} isRequired>
                            <FormLabel>{t("name.url.friendly")}</FormLabel>
                            <InputGroup>
                              <InputLeftAddon>
                                <FaGlobe />
                              </InputLeftAddon>
                              <Input
                                type={"text"}
                                name={"friendlyName"}
                                id={"new_content_friendlyName"}
                                placeholder={t("name.url.friendly")}
                                required
                                onChange={(e) => setURL(e.target.value)}
                              />
                            </InputGroup>
                          </FormControl>
                        </>
                      ) : index === 1 ? (
                        <>
                          <Builder custom_event_id={custom_event_id} />
                        </>
                      ) : index === 2 ? (
                        <>
                          <AdminQuizMaker
                            quizQuestions={quizQuestions}
                            setQuizQuestions={setQuizQuestions}
                          />
                        </>
                      ) : index === 3 ? (
                        <>
                          <FormControl isRequired>
                            <FormLabel>Video URL</FormLabel>
                            <InputGroup>
                              <InputLeftAddon>
                                youtube.com/watch?v=
                              </InputLeftAddon>
                              <Input
                                type={"text"}
                                name={"video"}
                                id={"new_content_video"}
                                placeholder={t("video.urk")}
                                required
                                onChange={(e) => {
                                  setVideoURL(
                                    "https://youtube.com/watch?v=" +
                                      e.target.value
                                  );
                                }}
                              />
                            </InputGroup>
                          </FormControl>
                        </>
                      ) : (
                        <></>
                      )}
                    </Step>
                  ))}
                </Steps>
                {activeStep === steps.length ? (
                  <Flex px={4} py={4} width="100%" flexDirection="column">
                    <Heading fontSize="xl" textAlign="center">
                      {t("create.course.all.steps.finished")}
                    </Heading>
                    <Button mx="auto" mt={6} size="sm" onClick={reset}>
                      {t("reset")}
                    </Button>
                  </Flex>
                ) : (
                  <Flex width="100%" justify="flex-end" mt={"2rem"}>
                    {activeStep === 1 || activeStep === 3 ? (
                      <>
                        <Button
                          mr={4}
                          size="lg"
                          onClick={() => {
                            if (activeStep === 1) {
                              setTextContent("__codeup.__no_text_content");
                              nextStep();
                            } else if (activeStep === 3) {
                              if (
                                textContent === "__codeup.__no_text_content"
                              ) {
                                alert(t("create.content.error.fields.empty"));
                                return;
                              } else {
                                (
                                  document.querySelector(
                                    ".new_content_submit"
                                  ) as HTMLButtonElement
                                ).click();
                              }
                            }
                          }}
                          colorScheme={"red"}
                        >
                          {t("skip")}
                        </Button>
                      </>
                    ) : null}
                    <Button
                      mr={4}
                      onClick={() => {
                        if (activeStep === 0) return;
                        prevStep();
                      }}
                      size="lg"
                    >
                      {t("previous")}
                    </Button>
                    <Button
                      size="lg"
                      id={"new_content_submit"}
                      variant={"brand"}
                      onClick={async () => {
                        if (activeStep !== steps.length - 1) {
                          switch (activeStep) {
                            case 0:
                              if (displayName === "" || url === "") {
                                return;
                              }
                              nextStep();
                              break;
                            case 1:
                              window.dispatchEvent(
                                new CustomEvent(
                                  "codeup::webbuilder::export_" +
                                    custom_event_id
                                )
                              );

                              const mergedCode =
                                // @ts-ignore
                                window.codeup.webBuilderHTMLExport;

                              setTextContent(mergedCode);

                              // @ts-ignore
                              delete window.codeup.webBuilderHTMLExport;

                              nextStep();
                              break;
                            case 2:
                              let anyAnswerEmpty = false;

                              for (const q of quizQuestions) {
                                for (const a of q.answers) {
                                  if (a.answer === "") {
                                    anyAnswerEmpty = true;
                                  }
                                }
                              }

                              if (anyAnswerEmpty) return;

                              nextStep();
                              break;
                            default:
                              break;
                          }
                        } else {
                          const res = await REST.Creator.createContent({
                            token: localStorage.getItem("token") as string,
                            course: course,
                            displayName,
                            quiz: quizQuestions,
                            textContent:
                              textContent !== "__codeup.__no_text_content"
                                ? textContent
                                : "",
                            type: "TEXT",
                            videoUrl: videoURL || "",
                            url,
                          });

                          if (res.status === 200) {
                            router.push("/creator/studio/" + course);
                          } else {
                            console.log(res.payload);
                            toast({
                              title: t("base:control.error"),
                              description:
                                t("error.creating") + ": " + res.payload.error,
                              status: "error",
                              duration: 1500,
                              isClosable: true,
                            });
                          }
                        }
                      }}
                    >
                      {activeStep === steps.length - 1
                        ? t("finish")
                        : t("next")}
                    </Button>
                  </Flex>
                )}
              </Flex>
            </>
          ) : (
            <>
              {!loaded && !error && (
                <Flex
                  w={"100%"}
                  h={"100vh"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  direction={"column"}
                >
                  <CircularProgress
                    size={"80px"}
                    isIndeterminate
                    color="purple.300"
                  />
                  <Heading size={"lg"} mt={4}>
                    {t("loading.course")}
                  </Heading>
                </Flex>
              )}
            </>
          )}
          {error && (
            <>
              <ErrorComponent description={t("loading.course.error")} />
            </>
          )}
        </>
      </CreatorStudioLayout>
    </>
  );
}

function randomString(length: number = 32) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
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
