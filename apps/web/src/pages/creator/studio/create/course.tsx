/**
 * apps/web/src/pages/admin/contents/courses/new.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.10.2022
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import AdminContentsLayout from "@codeup/components/admin/AdminContentsLayout";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FaBookOpen, FaGlobe } from "react-icons/fa";
import REST from "@codeup/rest";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import AdminQuizMaker from "@codeup/components/admin/AdminQuizMaker";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import CreatorStudioLayout from "@codeup/components/creator/studio/CreatorStudioLayout";
import Head from "next/head";
import { sProp } from "../../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

const SimpleMdeReact = dynamic(import("react-simplemde-editor"), {
  ssr: false,
});

export default function NewComponent() {
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });
  const { t } = useTranslation("creator-studio");
  const steps = [
    { label: t("name") },
    { label: t("description") },
    { label: t("splash.image") },
  ];

  const router = useRouter();

  const [quizQuestions, setQuizQuestions] = useState<
    {
      question: string;
      answers: {
        answer: string;
        correct: boolean;
      }[];
    }[]
  >([]);

  const [title, setTitle] = useState<string>("");
  const [friendlyName, setFriendlyName] = useState<string>("");
  const [splashImage, setSplashImage] = useState<File>();
  const [description, setDescription] = useState<string>("");

  const toast = useToast();

  return (
    <>
      <Head>
        <title>{t("create.course.doc.title")}</title>
      </Head>
      <CreatorStudioLayout>
        <Flex flexDir="column" width="100%" p={"5rem"}>
          <Heading size="lg" mb={"2rem"} textAlign={"left"}>
            {t("new.course")}
          </Heading>
          <Steps size={"lg"} activeStep={activeStep} colorScheme={"brand"}>
            {steps.map(({ label }, index) => (
              <Step label={label} key={label} mb={"2rem"}>
                {index === 0 ? (
                  <>
                    <FormControl isRequired>
                      <FormLabel>{t("title")}</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>
                          <FaBookOpen />
                        </InputLeftAddon>
                        <Input
                          type={"text"}
                          name={"title"}
                          id={"new_video_title"}
                          placeholder={t("title")}
                          defaultValue={title}
                          required
                          onChange={(e) => setTitle(e.target.value)}
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
                          id={"new_video_friendlyName"}
                          placeholder={t("name.url.friendly")}
                          defaultValue={friendlyName}
                          required
                          onChange={(e) =>
                            setFriendlyName(
                              e.target.value
                                .toLowerCase()
                                .replace(" ", "-")
                                .replace("ä", "ae")
                                .replace("ö", "oe")
                                .replace("ü", "ue")
                                .replace("ß", "ss")
                            )
                          }
                        />
                      </InputGroup>
                    </FormControl>
                  </>
                ) : index === 1 ? (
                  <>
                    <FormControl mt={"2rem"} isRequired>
                      <FormLabel>{t("description")}</FormLabel>
                      <Textarea
                        name={"description"}
                        placeholder={t("description")}
                        defaultValue={description}
                        required
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </FormControl>
                  </>
                ) : index === 2 ? (
                  <>
                    <FormControl mt={"2rem"} isRequired>
                      <FormLabel>{t("splash.image")}</FormLabel>
                      <Input
                        required
                        type={"file"}
                        name={"splashImage"}
                        onChange={(e) => {
                          // @ts-ignore
                          setSplashImage(e.target.files[0] as File);
                        }}
                        // only svg images
                        accept={"image/svg+xml"}
                      />
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
              <Button
                colorScheme={"red"}
                mr={4}
                onClick={() => {
                  if (activeStep === 0) {
                    router.push("/creator/studio");
                  } else {
                    prevStep();
                  }
                }}
                size="lg"
              >
                {activeStep === 0 ? t("cancel") : t("previous")}
              </Button>
              <Button
                size="lg"
                variant={"brand"}
                onClick={async () => {
                  if (activeStep !== steps.length - 1) {
                    switch (activeStep) {
                      case 0:
                        if (title === "" || friendlyName === "") return;
                        break;
                      case 1:
                        if (description === "") return;
                        break;
                      case 2:
                        if (!splashImage) return;
                        break;
                      default:
                        break;
                    }
                    nextStep();
                    return;
                  }

                  if (!splashImage) {
                    return;
                  }

                  const base64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(splashImage);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = (error) => console.log(error);
                  });

                  const res = await REST.Creator.createCourse({
                    token: localStorage.getItem("token") as string,
                    name: title,
                    friendlyName,
                    splashImage: base64,
                    description,
                  });

                  if (res.status === 200) {
                    router.push("/creator/studio");
                  } else {
                    toast({
                      title: t("base:control.error"),
                      description:
                        t("base:control.error.request") + res.payload.error,
                      status: "error",
                      duration: 1500,
                      isClosable: true,
                    });
                  }
                }}
              >
                {activeStep === steps.length - 1 ? t("finish") : t("next")}
              </Button>
            </Flex>
          )}
        </Flex>
      </CreatorStudioLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["creator-studio"])),
  };
}
