/**
 * apps/web/src/pages/admin/contents/new.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.11.2022
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
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import AdminQuizMaker from "@codeup/components/admin/AdminQuizMaker";
import { Step, Steps, useSteps } from "chakra-ui-steps";

const SimpleMdeReact = dynamic(import("react-simplemde-editor"), {
  ssr: false,
});

export default function NewContents() {
  const router = useRouter();

  const [courses, setCourses] = React.useState([]);

  useEffect(() => {
    REST.Admin.listCourses(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setCourses(res.payload.courses);
        }
      }
    );
  }, []);

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
    { label: "Kurs" },
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

  return (
    <>
      <AdminLayout>
        <AdminContentsLayout>
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
                    description: "Video basierter Inhalt mit optionalem Text",
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
                          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                            {courses.map((c: any) => {
                              return (
                                <>
                                  <GridItem m={4}>
                                    <Box
                                      bg={
                                        course === c._id
                                          ? "gray.700"
                                          : "gray.900"
                                      }
                                      transition={"background 0.5s ease-in-out"}
                                      color={"white"}
                                      rounded={"lg"}
                                      p={6}
                                      h={"100%"}
                                      onClick={() => {
                                        if (course === c._id) {
                                          setCourse("");
                                        } else {
                                          setCourse(c._id);
                                        }
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
                            <FormLabel>Beschreibung</FormLabel>
                            <SimpleMdeReact
                              value={textContent}
                              onChange={(e) => setTextContent(e)}
                            />
                          </FormControl>
                        </>
                      ) : index === 3 ? (
                        <>
                          <AdminQuizMaker
                            quizQuestions={quizQuestions}
                            setQuizQuestions={setQuizQuestions}
                          />
                        </>
                      ) : index === 4 && type === "VIDEO" ? (
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
                                onChange={(e) => setVideoURL(e.target.value)}
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
                              if (course === "") return;
                              nextStep();

                              break;
                            case 2:
                              if (textContent === "") return;
                              nextStep();
                              break;
                            case 3:
                              if (quizQuestions.length === 0) return;

                              nextStep();
                              break;
                            case 4:
                              if (type === "VIDEO") {
                                if (videoURL === "") return;
                              }
                              nextStep();
                              break;
                            default:
                              break;
                          }
                        } else {
                          const res = await REST.Admin.createContent({
                            token: localStorage.getItem("token") as string,
                            course,
                            displayName,
                            quiz: quizQuestions,
                            textContent,
                            type,
                            url,
                            videoUrl: "https://youtube.com/watch?v=" + videoURL,
                          });

                          if (res.status === 200) {
                            router.push("/admin/contents/courses/" + course);
                          } else {
                            alert(
                              "Fehler beim Erstellen des Inhalts. Deteils siehe Konsole."
                            );
                            console.log(res.payload);
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
        </AdminContentsLayout>
      </AdminLayout>
    </>
  );
}
