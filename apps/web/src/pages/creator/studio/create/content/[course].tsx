/**
 * apps/web/src/pages/creator/studio/create/content/[course].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.11.2022
 *
 */

import AdminContentsLayout from "@codeup/components/admin/AdminContentsLayout";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import REST from "@codeup/rest";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaBookOpen, FaGlobe, FaYoutube } from "react-icons/fa";
import {
  Box,
  Button,
  CircularProgress,
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
  useToast,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import AdminQuizMaker from "@codeup/components/admin/AdminQuizMaker";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import CreatorStudioLayout from "@codeup/components/creator/studio/CreatorStudioLayout";
import ErrorComponent from "@codeup/components/global/ErrorComponent";

const SimpleMdeReact = dynamic(import("react-simplemde-editor"), {
  ssr: false,
});

export default function NewContents() {
  const router = useRouter();

  const [displayName, setDisplayName] = React.useState("");
  const [course, setCourse] = React.useState("");
  const [url, setURL] = React.useState("");
  const [type, setType] = React.useState<"VIDEO" | "TEXT" | "">("");
  const [textContent, setTextContent] = React.useState("");
  const [quizQuestions, setQuizQuestions] = React.useState<
    {
      question: string;
      answers: {
        answer: string;
        correct: boolean;
      }[];
    }[]
  >([]);
  const [videoURL, setVideoURL] = React.useState("");

  const [steps, setSteps] = useState([
    { label: "Name" },
    { label: "Inhalt" },
    { label: "Quiz" },
  ]);

  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  useEffect(() => {
    if (type === "VIDEO" && !steps.find((s) => s.label === "Video URL")) {
      setSteps([
        ...steps,
        {
          label: "Video URL",
        },
      ]);
    }
  }, [type]);

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const toast = useToast();

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
      <CreatorStudioLayout>
        <Heading mt={6} textAlign={"center"}>
          Neuen Inhalt erstellen
        </Heading>
        <>
          {loaded && !error ? (
            <>
              {type === "" ? (
                <>
                  <Grid templateColumns="repeat(2, 1fr)" gap={6} p={12}>
                    {[
                      {
                        title: "Text",
                        description: "Text basierter Inhalt",
                        value: "TEXT",
                        icon: <FaBookOpen />,
                      },
                      {
                        title: "Video",
                        description:
                          "Video basierter Inhalt mit optionalem Text",
                        value: "VIDEO",
                        icon: <FaYoutube />,
                      },
                    ].map((item, index) => {
                      return (
                        <>
                          <GridItem key={index}>
                            <Box
                              onClick={() => {
                                setType(item.value as "VIDEO" | "TEXT");
                              }}
                              cursor="pointer"
                              p={4}
                              borderWidth="1px"
                              borderRadius="lg"
                              _hover={{
                                borderColor: "blue.500",
                              }}
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                w="100%"
                                h="100px"
                                borderRadius="lg"
                                bg="blue.500"
                                color="white"
                                fontSize="4xl"
                              >
                                {item.icon}
                              </Box>
                              <Box mt={4}>
                                <Box fontSize="2xl">{item.title}</Box>
                                <Box color="gray.400">{item.description}</Box>
                              </Box>
                            </Box>
                          </GridItem>
                        </>
                      );
                    })}
                  </Grid>
                </>
              ) : (
                <>
                  <Flex flexDir="column" width="100%" p={"5rem"}>
                    <Heading size="lg" mb={"2rem"} textAlign={"left"}>
                      {type === "VIDEO" ? "Neues Video" : "Neuer Text"}
                    </Heading>
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
                                    id={"new_content_title"}
                                    placeholder={"Titel"}
                                    required
                                    onChange={(e) =>
                                      setDisplayName(e.target.value)
                                    }
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
                                    id={"new_content_friendlyName"}
                                    placeholder={"URL Freundlicher Name"}
                                    required
                                    onChange={(e) => setURL(e.target.value)}
                                  />
                                </InputGroup>
                              </FormControl>
                            </>
                          ) : index === 1 ? (
                            <>
                              <FormControl mt={"2rem"} isRequired>
                                <FormLabel>Beschreibung</FormLabel>
                                <SimpleMdeReact
                                  value={textContent}
                                  onChange={(e) => setTextContent(e)}
                                />
                              </FormControl>
                            </>
                          ) : index === 2 ? (
                            <>
                              <AdminQuizMaker
                                quizQuestions={quizQuestions}
                                setQuizQuestions={setQuizQuestions}
                              />
                            </>
                          ) : index === 3 && type === "VIDEO" ? (
                            <>
                              <FormControl mt={"2rem"} isRequired>
                                <FormLabel>YouTube URL</FormLabel>
                                <InputGroup>
                                  <InputLeftAddon>
                                    youtube.com/watch?v=
                                  </InputLeftAddon>
                                  <Input
                                    type={"text"}
                                    name={"youtubeId"}
                                    placeholder={"Video-ID"}
                                    required
                                    onChange={(e) =>
                                      setVideoURL(e.target.value)
                                    }
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
                          Woohoo! All steps completed!
                        </Heading>
                        <Button mx="auto" mt={6} size="sm" onClick={reset}>
                          Zurücksetzen
                        </Button>
                      </Flex>
                    ) : (
                      <Flex width="100%" justify="flex-end" mt={"2rem"}>
                        <Button
                          mr={4}
                          onClick={() => {
                            if (activeStep === 0) {
                              setType("");
                            } else {
                              prevStep();
                            }
                          }}
                          size="lg"
                          variant="ghost"
                        >
                          {activeStep > 0 ? "Vorheriger" : "Typ Ändern"}
                        </Button>
                        <Button
                          size="lg"
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
                                  if (textContent === "") return;
                                  nextStep();
                                  break;
                                case 2:
                                  if (quizQuestions.length === 0) return;
                                  nextStep();
                                  break;
                                case 3:
                                  if (type === "VIDEO" && videoURL === "")
                                    return;
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
                                textContent,
                                type: type === "VIDEO" ? "VIDEO" : "TEXT",
                                url,
                                videoUrl: videoURL
                                  ? "https://youtube.com/watch?v=" + videoURL
                                  : "",
                              });

                              if (res.status === 200) {
                                router.push("/creator/studio/" + course);
                              } else {
                                console.log(res.payload);
                                toast({
                                  title: "Fehler",
                                  description:
                                    "Fehler beim Erstellen: " +
                                    res.payload.error,
                                  status: "error",
                                  duration: 1500,
                                  isClosable: true,
                                });
                              }
                            }
                          }}
                        >
                          {activeStep === steps.length - 1
                            ? "Fertigstellen"
                            : "Nächster"}
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                </>
              )}
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
                    Lade Kurs...
                  </Heading>
                </Flex>
              )}
            </>
          )}
          {error && (
            <>
              <ErrorComponent description={"Fehler beim Laden der Kurse."} />
            </>
          )}
        </>
      </CreatorStudioLayout>
    </>
  );
}
