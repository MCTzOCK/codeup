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
} from "@chakra-ui/react";
import { FaBookOpen, FaGlobe } from "react-icons/fa";
import REST from "@codeup/rest";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import AdminQuizMaker from "@codeup/components/admin/AdminQuizMaker";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import Head from "next/head";
import SuperText from "@codeup/components/dist/landingpage/SuperText";

const SimpleMdeReact = dynamic(import("react-simplemde-editor"), {
  ssr: false,
});

export default function NewComponent() {
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });
  const steps = [
    { label: "Name" },
    { label: "Beschreibung" },
    { label: "Vorschaubild" },
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

  return (
    <>
      <Head>
        <title>Neuer Kurs - Admin - CodeUp</title>
      </Head>
      <AdminLayout>
        <AdminContentsLayout>
          <Flex flexDir="column" width="100%" p={"5rem"}>
            <Box mt={8}></Box>
            <SuperText>Kurse</SuperText>
            <Steps size={"lg"} activeStep={activeStep}>
              {steps.map(({ label }, index) => (
                <Step label={label} key={label} mb={"2rem"}>
                  {index === 0 ? (
                    <>
                      <FormControl isRequired>
                        <FormLabel>Titel</FormLabel>
                        <InputGroup>
                          <InputLeftAddon>
                            <FaBookOpen />
                          </InputLeftAddon>
                          <Input
                            type={"text"}
                            name={"title"}
                            id={"new_video_title"}
                            placeholder={"Titel"}
                            required
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl mt={"2rem"} isRequired>
                        <FormLabel>URL Freundlicher Name</FormLabel>
                        <InputGroup>
                          <InputLeftAddon>
                            <FaGlobe />
                          </InputLeftAddon>
                          <Input
                            type={"text"}
                            name={"friendlyName"}
                            id={"new_video_friendlyName"}
                            placeholder={"URL Freundlicher Name"}
                            required
                            onChange={(e) => setFriendlyName(e.target.value)}
                          />
                        </InputGroup>
                      </FormControl>
                    </>
                  ) : index === 1 ? (
                    <>
                      <FormControl mt={"2rem"} isRequired>
                        <FormLabel>Beschreibung</FormLabel>
                        <Textarea
                          name={"description"}
                          placeholder={"Beschreibung"}
                          required
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </FormControl>
                    </>
                  ) : index === 2 ? (
                    <>
                      <FormControl mt={"2rem"} isRequired>
                        <FormLabel>Vorschaubild</FormLabel>
                        <Input
                          required
                          type={"file"}
                          accept="image/svg+xml"
                          name={"splashImage"}
                          onChange={(e) => {
                            // @ts-ignore
                            setSplashImage(e.target.files[0] as File);
                          }}
                        />
                      </FormControl>
                    </>
                  ) : index === 3 ? (
                    <>
                      <FormControl mt={"2rem"} isRequired>
                        <FormLabel>Beschreibung</FormLabel>
                        <SimpleMdeReact
                          value={description}
                          onChange={(e) => setDescription(e)}
                        />
                      </FormControl>
                    </>
                  ) : index === 4 ? (
                    <>
                      <AdminQuizMaker
                        quizQuestions={quizQuestions}
                        setQuizQuestions={setQuizQuestions}
                      />
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
                  Woohoo! All steps completed!
                </Heading>
                <Button mx="auto" mt={6} size="sm" onClick={reset}>
                  Zurücksetzen
                </Button>
              </Flex>
            ) : (
              <Flex width="100%" justify="flex-end" mt={"2rem"}>
                <Button
                  isDisabled={activeStep === 0}
                  mr={4}
                  onClick={prevStep}
                  size="lg"
                  variant="ghost"
                >
                  Vorheriger
                </Button>
                <Button
                  size="lg"
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

                    const base64 = await new Promise<string>((resolve) => {
                      if (splashImage) {
                        const reader = new FileReader();
                        reader.readAsDataURL(splashImage);
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = (error) => console.log(error);
                      } else {
                        resolve("");
                      }
                    });

                    await REST.Admin.createCourse({
                      token: localStorage.getItem("token") as string,
                      name: title,
                      friendlyName,
                      splashImage: base64,
                      description,
                    });

                    router.push("/admin/contents/courses");
                  }}
                >
                  {activeStep === steps.length - 1
                    ? "Fertigstellen"
                    : "Nächster"}
                </Button>
              </Flex>
            )}
          </Flex>
        </AdminContentsLayout>
      </AdminLayout>
    </>
  );
}
