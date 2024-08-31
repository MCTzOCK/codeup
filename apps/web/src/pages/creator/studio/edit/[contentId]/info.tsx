/**
 * apps/web/src/pages/creator/studio/edit/[contentId]/info.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.11.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import REST from "@codeup/rest";
import CreatorStudioLayout from "@codeup/components/creator/studio/CreatorStudioLayout";
import { FaPen } from "react-icons/fa";
import AdminQuizMaker from "@codeup/components/admin/AdminQuizMaker";
import InteractiveLessonCreator from "@codeup/components/creator/studio/InteractiveLessonCreator";
import Head from "next/head";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import { IResponse } from "@codeup/rest/dist/types/IResponse";
import { string } from "blockly/core/utils";

export default function Info() {
  const router = useRouter();

  const { contentId } = router.query;
  const { t } = useTranslation("creator-studio");

  const [content, setContent] = React.useState<{
    _id: string;
    displayName: string;
    course: string;
    url: string;
    textContent: string;
    type: string;
    videoUrl: string;
    quiz: {
      question: string;
      answers: {
        answer: string;
        correct: boolean;
      }[];
    };
  }>();

  const toast = useToast();

  const [quiz, setQuiz] = React.useState<
    {
      question: string;
      answers: {
        answer: string;
        correct: boolean;
      }[];
    }[]
  >([]);
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

  useEffect(() => {
    if (contentId) {
      REST.Creator.getContents({
        token: localStorage.getItem("token") as string,
        contentId: contentId as string,
      }).then((res) => {
        if (res.status === 200) {
          setContent(res.payload.content);
          if (res.payload.content.type === "INTERACTIVE") {
            const p = JSON.parse(res.payload.content.textContent);
            setISteps(p.steps);
            setIntro(p.intro);
          } else {
            setQuiz(res.payload.content.quiz);
          }
        } else {
          toast({
            title: t("base:control.error"),
            description: t("error.loading") + ": " + res.payload.error,
            status: "error",
            duration: 1500,
            isClosable: true,
            position: "bottom-left",
          });
        }
      });
    }
  }, [contentId]);

  return (
    <>
      <Head>
        <title>{t("edit.content.doc.title")}</title>
      </Head>
      <CreatorStudioLayout>
        <Box textAlign={"center"} pt={"2rem"}>
          <CHeading size={"xl"}>{t("edit")}</CHeading>
        </Box>
        {content ? (
          <>
            <Flex
              flexDir="column"
              width="100%"
              p={"5rem"}
              minH={"100vh"}
              alignItems={"center"}
            >
              <Flex flexDir="column" width={["100", "35%"]}>
                <Stack spacing={4} width={"100%"}>
                  <FormControl id="displayName">
                    <FormLabel>{t("display.name")}</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <FaPen />
                      </InputLeftElement>
                      <Input
                        name={"displayName"}
                        defaultValue={content.displayName}
                        placeholder={t("display.name")}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl id="url">
                    <FormLabel>{t("url")}</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <FaPen />
                      </InputLeftElement>
                      <Input
                        name={"url"}
                        defaultValue={content.url}
                        placeholder={t("url")}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl
                    id="url"
                    display={
                      content.type === "INTERACTIVE" ? "none" : "initial"
                    }
                  >
                    <FormLabel>{t("video.url")}</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <FaPen />
                      </InputLeftElement>
                      <Input
                        name={"video-url"}
                        defaultValue={content.videoUrl}
                        placeholder={t("video.url")}
                      />
                    </InputGroup>
                  </FormControl>
                  {content.type === "INTERACTIVE" ? (
                    <>
                      <FormControl id="intro">
                        <FormLabel>{t("interactive.intro")}</FormLabel>
                        <Textarea
                          name={"intro"}
                          defaultValue={intro}
                          placeholder={t("interactive.intro")}
                        />
                      </FormControl>
                      <InteractiveLessonCreator
                        steps={iSteps}
                        setSteps={setISteps}
                      />
                    </>
                  ) : (
                    <AdminQuizMaker
                      quizQuestions={quiz}
                      setQuizQuestions={setQuiz}
                    />
                  )}
                </Stack>
              </Flex>
              <ButtonGroup
                mt={"2rem"}
                w={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Button
                  size={"lg"}
                  colorScheme={"red"}
                  onClick={() => {
                    router.back();
                  }}
                >
                  {t("cancel")}
                </Button>
                <Button
                  size={"lg"}
                  variant={"brand"}
                  onClick={async () => {
                    const displayName = document.querySelector(
                      "input[name=displayName]"
                    ) as HTMLInputElement;
                    const url = document.querySelector(
                      "input[name=url]"
                    ) as HTMLInputElement;
                    let res: IResponse;

                    if (content.type === "INTERACTIVE") {
                      const intro = document.querySelector(
                        "textarea[name=intro]"
                      ) as HTMLTextAreaElement;

                      res = await REST.Creator.updateContent({
                        token: localStorage.getItem("token") as string,
                        cid: content._id,
                        update: {
                          displayName: displayName.value || content.displayName,
                          url: url.value || content.url,
                          quiz: quiz || content.quiz,
                          textContent: JSON.stringify({
                            steps: iSteps,
                            intro: intro.value,
                          }),
                        },
                      });
                    } else {
                      const videoUrl = document.querySelector(
                        "input[name=video-url]"
                      ) as HTMLInputElement;

                      res = await REST.Creator.updateContent({
                        token: localStorage.getItem("token") as string,
                        cid: content._id,
                        update: {
                          displayName: displayName.value || content.displayName,
                          url: url.value || content.url,
                          quiz: quiz || content.quiz,
                          videoUrl: videoUrl.value || content.videoUrl,
                        },
                      });
                    }
                    if (res.status === 200) {
                      router.back();
                    } else {
                      toast({
                        title: t("base:control.error"),
                        description:
                          t("error.saving") + ": " + res.payload.error,
                        status: "error",
                        duration: 1500,
                        isClosable: true,
                        position: "bottom-left",
                      });
                    }
                  }}
                >
                  {t("save")}
                </Button>
              </ButtonGroup>
            </Flex>
          </>
        ) : null}
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
