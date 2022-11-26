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
  Button,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Heading,
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
import Builder from "../../../../../special-components/Builder";

export default function NewContents() {
  const router = useRouter();

  const [displayName, setDisplayName] = React.useState("");
  const [course, setCourse] = React.useState("");
  const [url, setURL] = React.useState("");
  const [textContent, setTextContent] = React.useState("");
  const [videoURL, setVideoURL] = React.useState("");
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
    { label: "Name" },
    { label: "Inhalt" },
    { label: "Quiz" },
    { label: "Video" },
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
      <CreatorStudioLayout>
        <Heading mt={6} textAlign={"center"}>
          Neuen Inhalt erstellen
        </Heading>
        <>
          {loaded && !error ? (
            <>
              <Flex flexDir="column" width="100%" p={"5rem"}>
                <Heading size="lg" mb={"2rem"} textAlign={"left"}>
                  Neuer Inhalt
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
                                onChange={(e) => setDisplayName(e.target.value)}
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
                                placeholder={"Video URL"}
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
                      Woohoo! All steps completed!
                    </Heading>
                    <Button mx="auto" mt={6} size="sm" onClick={reset}>
                      Zurücksetzen
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
                                alert(
                                  "Du musst mindestens eine der folgenden Sachen ausfüllen: Text, Video"
                                );
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
                          Überspringen
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
                      variant="ghost"
                    >
                      Vorheriger
                    </Button>
                    <Button
                      size="lg"
                      id={"new_content_submit"}
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
                              if (quizQuestions.length === 0) return;

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
                              title: "Fehler",
                              description:
                                "Fehler beim Erstellen: " + res.payload.error,
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

function randomString(length: number = 32) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}
