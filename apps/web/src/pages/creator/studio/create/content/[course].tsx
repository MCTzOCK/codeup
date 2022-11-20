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
import Builder from "../../../../../special-components/Builder";

const SimpleMdeReact = dynamic(import("react-simplemde-editor"), {
  ssr: false,
});

export default function NewContents() {
  const router = useRouter();

  const [displayName, setDisplayName] = React.useState("");
  const [course, setCourse] = React.useState("");
  const [url, setURL] = React.useState("");
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

  const [steps, setSteps] = useState([
    { label: "Name" },
    { label: "Inhalt" },
    { label: "Quiz" },
  ]);

  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

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
                          <Builder />
                        </>
                      ) : index === 2 ? (
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
                                new CustomEvent("codeup::webbuilder::export")
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
                            type: "TEXT",
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
