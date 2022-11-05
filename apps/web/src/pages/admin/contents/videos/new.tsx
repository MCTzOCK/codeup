/**
 * apps/web/src/pages/admin/contents/videos/new.tsx
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
} from "@chakra-ui/react";
import { FaBookOpen, FaGlobe } from "react-icons/fa";
import REST from "@codeup/rest";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import AdminQuizMaker from "@codeup/components/admin/AdminQuizMaker";
import { Step, Steps, useSteps } from "chakra-ui-steps";

const SimpleMdeReact = dynamic(import("react-simplemde-editor"), {
  ssr: false,
});

export default function NewComponent() {
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });
  const steps = [
    { label: "Name" },
    { label: "Kurs" },
    { label: "YouTube" },
    { label: "Transkript" },
    { label: "Quiz" },
  ];

  const router = useRouter();

  const [courses, setCourses] = useState<any[]>([]);

  const [newQuestion, setNewQuestion] = useState<string>("");

  const [quizQuestions, setQuizQuestions] = useState<
    {
      question: string;
      answers: {
        answer: string;
        correct: boolean;
      }[];
    }[]
  >([]);

  useEffect(() => {
    REST.Admin.listCourses(localStorage.getItem("token") as string).then(
      (res) => {
        setCourses(res.payload.courses);
      }
    );
  }, []);

  const [title, setTitle] = useState<string>("");
  const [friendlyName, setFriendlyName] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");

  return (
    <>
      <AdminLayout>
        <AdminContentsLayout>
          <Flex flexDir="column" width="100%" p={"5rem"}>
            <Heading size="lg" mb={"2rem"} textAlign={"center"}>
              Neues Video
            </Heading>
            <Steps size={"lg"} activeStep={activeStep}>
              {steps.map(({ label }, index) => (
                <Step label={label} key={label}>
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
                      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                        {courses.map((c: any) => {
                          return (
                            <>
                              <GridItem m={4}>
                                <Box
                                  bg={
                                    course === c._id ? "gray.700" : "gray.900"
                                  }
                                  transition={"background 0.5s ease-in-out"}
                                  color={"white"}
                                  rounded={"lg"}
                                  p={6}
                                  h={"100%"}
                                  onClick={() => {
                                    setCourse(c._id);
                                  }}
                                  cursor={"pointer"}
                                >
                                  <Flex
                                    justifyContent={"space-between"}
                                    direction={"column"}
                                    gap={2}
                                  >
                                    <Image
                                      src={c.splashImage}
                                      alt={c.name}
                                      shadow={"xl"}
                                      w={"100%"}
                                      h={"150px"}
                                    />
                                    <Heading
                                      size={"lg"}
                                      color={"white"}
                                      fontWeight={"bold"}
                                      textAlign={"left"}
                                      mt={4}
                                    >
                                      {c.name}
                                    </Heading>
                                    <Heading
                                      size={"sm"}
                                      color={"gray.400"}
                                      fontWeight={"normal"}
                                      textAlign={"left"}
                                    >
                                      /course/{c.friendlyName}
                                    </Heading>
                                    <Heading
                                      size={"md"}
                                      color={"gray.400"}
                                      fontWeight={"normal"}
                                      textAlign={"left"}
                                    >
                                      {c.description}
                                    </Heading>
                                  </Flex>
                                </Box>
                              </GridItem>
                            </>
                          );
                        })}
                      </Grid>
                    </>
                  ) : index === 2 ? (
                    <>
                      <FormControl mt={"2rem"} isRequired>
                        <FormLabel>YouTube URL</FormLabel>
                        <InputGroup>
                          <InputLeftAddon>youtube.com/watch?v=</InputLeftAddon>
                          <Input
                            type={"text"}
                            name={"youtubeId"}
                            placeholder={"Video-ID"}
                            required
                            onChange={(e) => setYoutube(e.target.value)}
                          />
                        </InputGroup>
                      </FormControl>
                    </>
                  ) : index === 3 ? (
                    <>
                      <FormControl mt={"2rem"} isRequired>
                        <FormLabel>Beschreibung</FormLabel>
                        <SimpleMdeReact
                          value={transcript}
                          onChange={(e) => setTranscript(e)}
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
                          if (course === "") return;
                          break;
                        case 2:
                          if (youtube === "") return;
                          break;
                        case 3:
                          if (transcript === "") return;
                          break;
                        default:
                          break;
                      }
                      nextStep();
                      return;
                    }

                    await REST.Admin.createVideo({
                      token: localStorage.getItem("token") as string,
                      transcript,
                      title,
                      friendlyName,
                      course,
                      quiz: quizQuestions,
                      youtubeURL: `https://www.youtube.com/watch?v=${youtube}`,
                    });

                    router.push("/admin/contents/videos");
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
