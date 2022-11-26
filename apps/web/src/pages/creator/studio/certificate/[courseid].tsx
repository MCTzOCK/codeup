/**
 * apps/web/src/pages/creator/studio/certificate/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.11.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import CreatorStudioLayout from "@codeup/components/creator/studio/CreatorStudioLayout";
import {
  Heading,
  useToast,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Box,
  Flex,
  Stack,
  FormControl,
  FormLabel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Select,
  Button,
  Input,
  Badge,
  IconButton,
  InputGroup,
  Grid,
  Switch,
} from "@chakra-ui/react";
import REST from "@codeup/rest";
import { FaPlus, FaTrash } from "react-icons/fa";
import * as Builders from "@codeup/util/src/certificates/CertificateBuilder";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

export default function CertificateEditor() {
  const router = useRouter();

  const [course, setCourse] = React.useState<{
    _id: string;
    name: string;
    friendlyName: string;
    description: string;
    splashImage: string;
    available: boolean;
    contentPositions: string[];
    createdAt: string;
    creator: string;
    __v: number;
  }>();

  const toast = useToast();

  const { courseid } = router.query;
  React.useEffect(() => {
    if (courseid) {
      REST.Course.getCourse({
        course: courseid as string,
      }).then(async (res) => {
        if (res.status === 200) {
          setCourse(res.payload.course);
        } else {
          toast({
            title: "Error",
            description:
              "Der Kurs konnte nicht geladen werden. Denke daran ihn zuerst zu veröffentlichen.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      });
    }
  }, [courseid]);

  const [certificate, setCertificate] = React.useState<any>(null);
  const [minPercentage, setMinPercentage] = React.useState(75);
  const [steps, setSteps] = React.useState<
    {
      step_type: "MULTIPLE_CHOICE" | "TEXT" | "CODE_COMPARE" | "CODE_CHECK";
      step_title: string;
      multiple_choice?: {
        question: string;
        answers: {
          answer: string;
          correct: boolean;
        }[];
      };
      text_parts?: {
        type: "TEXT" | "INPUT";
        value: string;
        id: number;
      }[];
      code_compare?: {
        code_a: {
          correct: boolean;
          screenshot: string;
        };
        code_b: {
          correct: boolean;
          screenshot: string;
        };
        output: string;
      };
      code_check?: {
        code_a: {
          correct: boolean;
          screenshot: string;
        };
        code_b: {
          correct: boolean;
          screenshot: string;
        };
      };
    }[]
  >([]);

  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

  const [hidePlusButton, setHidePlusButton] = React.useState(false);

  React.useEffect(() => {
    if (courseid) {
      REST.Creator.updateCertificate({
        token: localStorage.getItem("token") as string,
        courseId: courseid as string,
        update: {
          minPercentage: minPercentage,
        },
      });
    }
  }, [minPercentage]);

  React.useEffect(() => {
    if (courseid) {
      REST.Creator.updateCertificate({
        token: localStorage.getItem("token") as string,
        courseId: courseid as string,
        update: {
          steps: steps,
        },
      });
    }
  }, [steps]);

  React.useEffect(() => {
    if (courseid) {
      REST.Creator.getCertificate({
        courseId: courseid as string,
        token: localStorage.getItem("token") as string,
      }).then(async (res) => {
        if (res.status === 200) {
          setCertificate(res.payload.certificate);
          setMinPercentage(res.payload.certificate.minPercentage);
          setSteps(res.payload.certificate.steps);
        } else if (res.status === 404) {
          REST.Creator.createCertificate({
            courseId: courseid as string,
            token: localStorage.getItem("token") as string,
          }).then(async (res0) => {
            if (res0.status === 200) {
              setCertificate(res0.payload.certificate);
              setMinPercentage(res0.payload.certificate.minPercentage);
              setSteps(res0.payload.certificate.steps);
            } else {
              toast({
                title: "Error",
                description: "Das Zertifikat konnte nicht erstellt werden.",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            }
          });
        }
      });
    }
  }, [courseid]);

  return (
    <CreatorStudioLayout>
      <Heading size={"xl"} textAlign={"center"} mt={8}>
        Zertifikat Editor
      </Heading>

      <Stack w={"100%"} alignItems={"center"} justifyContent={"center"}>
        <Box w={"70%"}>
          <Flex
            w={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
            direction={"column"}
          >
            <FormControl maxW={"25%"} mt={8}>
              <FormLabel>Mindestpunktzahl (in %)</FormLabel>
              <Box pt={6} pb={2}>
                <Slider
                  aria-label="slider-ex-6"
                  value={minPercentage}
                  onChange={(val) => setMinPercentage(val)}
                >
                  <SliderMark value={25} {...labelStyles}>
                    25%
                  </SliderMark>
                  <SliderMark value={50} {...labelStyles}>
                    50%
                  </SliderMark>
                  <SliderMark value={75} {...labelStyles}>
                    75%
                  </SliderMark>
                  <SliderMark
                    value={minPercentage}
                    textAlign="center"
                    bg="blue.500"
                    color="white"
                    mt="-10"
                    ml="-5"
                    w="12"
                  >
                    {minPercentage}%
                  </SliderMark>
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
            </FormControl>

            <Box w={"75%"}>
              <Heading size={"lg"} textAlign={"center"} mt={8}>
                Schritte
              </Heading>

              {steps.length === 0 ? (
                <Box
                  mt={8}
                  bgColor={"gray.900"}
                  w={"100%"}
                  minH={"10vh"}
                  rounded={"xl"}
                >
                  <Flex
                    w={"100%"}
                    h={"10vh"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    direction={"column"}
                  >
                    <Heading
                      size={"md"}
                      textAlign={"center"}
                      color={"gray.200"}
                    >
                      Es wurden noch keine Schritte hinzugefügt.
                    </Heading>
                  </Flex>
                </Box>
              ) : (
                <>
                  <DragDropContext
                    onDragStart={() => setHidePlusButton(true)}
                    onDragEnd={(result) => {
                      setHidePlusButton(false);

                      if (!result.destination) return;

                      const items = Array.from(steps);

                      const [reorderedItem] = items.splice(
                        result.source.index,
                        1
                      );

                      items.splice(result.destination.index, 0, reorderedItem);

                      setSteps(items);
                    }}
                  >
                    <Droppable droppableId={"steps"}>
                      {(provided, snapshot) => (
                        <>
                          <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            p={"2rem"}
                          >
                            {steps.map((step, index) => (
                              <>
                                <Draggable
                                  key={step.step_title}
                                  draggableId={step.step_title}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <>
                                      <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        mt={8}
                                        bgColor={"gray.900"}
                                        w={"100%"}
                                        minH={"10vh"}
                                        rounded={"xl"}
                                        p={"1.2rem"}
                                      >
                                        <Badge
                                          color={
                                            step.step_type === "MULTIPLE_CHOICE"
                                              ? "green.400"
                                              : step.step_type === "TEXT"
                                              ? "blue.400"
                                              : step.step_type ===
                                                "CODE_COMPARE"
                                              ? "purple.400"
                                              : "yellow.400"
                                          }
                                          ml={2}
                                          mt={2}
                                        >
                                          {step.step_type === "MULTIPLE_CHOICE"
                                            ? "Multiple Choice"
                                            : step.step_type === "TEXT"
                                            ? "Text"
                                            : step.step_type === "CODE_COMPARE"
                                            ? "Code Vergleich"
                                            : "Code Check"}
                                        </Badge>
                                        <Flex
                                          w={"100%"}
                                          alignItems={"center"}
                                          justifyContent={"space-between"}
                                          direction={"row"}
                                        >
                                          <Heading
                                            size={"md"}
                                            textAlign={"center"}
                                            color={"gray.200"}
                                            ml={2}
                                          >
                                            {step.step_title}
                                          </Heading>
                                          <IconButton
                                            aria-label="Delete Step"
                                            icon={<FaTrash />}
                                            colorScheme="red"
                                            onClick={() => {
                                              setSteps(
                                                steps.filter(
                                                  (s) =>
                                                    s.step_title !==
                                                    step.step_title
                                                )
                                              );
                                            }}
                                          />
                                        </Flex>
                                        {step.step_type ===
                                        "MULTIPLE_CHOICE" ? (
                                          <>
                                            <Box
                                              display={
                                                hidePlusButton
                                                  ? "none"
                                                  : "inherit"
                                              }
                                            >
                                              <FormControl>
                                                <FormLabel>Frage</FormLabel>
                                                <Input
                                                  defaultValue={
                                                    step.multiple_choice
                                                      ?.question || ""
                                                  }
                                                  onChange={(e) => {
                                                    // @ts-ignore
                                                    setSteps(
                                                      // @ts-ignore
                                                      steps.map((s) =>
                                                        s.step_title ===
                                                        step.step_title
                                                          ? {
                                                              ...s,
                                                              multiple_choice: {
                                                                ...s.multiple_choice,
                                                                question:
                                                                  e.target
                                                                    .value,
                                                              },
                                                            }
                                                          : s
                                                      )
                                                    );
                                                  }}
                                                />
                                              </FormControl>
                                              <Grid
                                                templateColumns={
                                                  "repeat(2, 1fr)"
                                                }
                                                gap={6}
                                                mt={4}
                                              >
                                                {(
                                                  step.multiple_choice
                                                    ?.answers || []
                                                ).map((answer, index) => (
                                                  <>
                                                    <FormControl>
                                                      <FormLabel>
                                                        Antwort {index + 1}
                                                      </FormLabel>
                                                      <Input
                                                        defaultValue={
                                                          answer.answer
                                                        }
                                                        onChange={(e) => {
                                                          setSteps(
                                                            // @ts-ignore
                                                            steps.map((s) =>
                                                              s.step_title ===
                                                              step.step_title
                                                                ? {
                                                                    ...s,
                                                                    multiple_choice:
                                                                      {
                                                                        ...s.multiple_choice,
                                                                        answers:
                                                                          s.multiple_choice?.answers.map(
                                                                            (
                                                                              a,
                                                                              i
                                                                            ) =>
                                                                              i ===
                                                                              index
                                                                                ? {
                                                                                    ...a,
                                                                                    answer:
                                                                                      e
                                                                                        .target
                                                                                        .value,
                                                                                  }
                                                                                : a
                                                                          ),
                                                                      },
                                                                  }
                                                                : s
                                                            )
                                                          );
                                                        }}
                                                      />
                                                    </FormControl>
                                                    <FormControl>
                                                      <FormLabel>
                                                        Ist die Antwort richtig?
                                                      </FormLabel>
                                                      <Switch
                                                        isChecked={
                                                          answer.correct
                                                        }
                                                        onChange={() => {
                                                          setSteps(
                                                            // @ts-ignore
                                                            steps.map((s) =>
                                                              s.step_title ===
                                                              step.step_title
                                                                ? {
                                                                    ...s,
                                                                    multiple_choice:
                                                                      {
                                                                        ...s.multiple_choice,
                                                                        answers:
                                                                          s.multiple_choice?.answers.map(
                                                                            (
                                                                              a,
                                                                              i
                                                                            ) =>
                                                                              i ===
                                                                              index
                                                                                ? {
                                                                                    ...a,
                                                                                    correct:
                                                                                      !a.correct,
                                                                                  }
                                                                                : a
                                                                          ),
                                                                      },
                                                                  }
                                                                : s
                                                            )
                                                          );
                                                        }}
                                                      />
                                                    </FormControl>
                                                  </>
                                                ))}
                                              </Grid>
                                            </Box>
                                          </>
                                        ) : null}
                                        {step.step_type === "TEXT" && (
                                          <>
                                            <Box
                                              display={
                                                hidePlusButton
                                                  ? "none"
                                                  : "inherit"
                                              }
                                            >
                                              <Grid
                                                templateColumns={
                                                  "repeat(3, 1fr)"
                                                }
                                                gap={6}
                                                mt={4}
                                              >
                                                {step.text_parts?.map((t) => (
                                                  <>
                                                    <FormControl mt={1}>
                                                      <FormLabel>
                                                        {t.type === "INPUT"
                                                          ? "Eingabefeld"
                                                          : "Text"}
                                                      </FormLabel>
                                                      <Input
                                                        defaultValue={t.value}
                                                        onChange={(e) => {
                                                          // use indexes instead of id
                                                          setSteps(
                                                            steps.map((s) =>
                                                              s.step_title ===
                                                              step.step_title
                                                                ? {
                                                                    ...s,
                                                                    text_parts:
                                                                      s.text_parts?.map(
                                                                        (t2) =>
                                                                          t2.id ===
                                                                          t.id
                                                                            ? {
                                                                                ...t2,
                                                                                value:
                                                                                  e
                                                                                    .target
                                                                                    .value,
                                                                              }
                                                                            : t2
                                                                      ),
                                                                  }
                                                                : s
                                                            )
                                                          );
                                                        }}
                                                      />
                                                    </FormControl>
                                                    <FormControl mt={1}>
                                                      <FormLabel>
                                                        Eingabefeld
                                                      </FormLabel>
                                                      <Switch
                                                        isChecked={
                                                          t.type === "INPUT"
                                                        }
                                                        onChange={() => {
                                                          setSteps(
                                                            steps.map((s) =>
                                                              s.step_title ===
                                                              step.step_title
                                                                ? {
                                                                    ...s,
                                                                    text_parts:
                                                                      s.text_parts?.map(
                                                                        (t2) =>
                                                                          t2.value ===
                                                                          t.value
                                                                            ? {
                                                                                ...t2,
                                                                                type:
                                                                                  t2.type ===
                                                                                  "INPUT"
                                                                                    ? "TEXT"
                                                                                    : "INPUT",
                                                                              }
                                                                            : t2
                                                                      ),
                                                                  }
                                                                : s
                                                            )
                                                          );
                                                        }}
                                                      />
                                                    </FormControl>
                                                    <FormControl mt={1}>
                                                      <FormLabel>
                                                        Aktion
                                                      </FormLabel>
                                                      <Button
                                                        colorScheme="red"
                                                        onClick={() => {
                                                          setSteps(
                                                            steps.map((s) =>
                                                              s.step_title ===
                                                              step.step_title
                                                                ? {
                                                                    ...s,
                                                                    text_parts:
                                                                      s.text_parts?.filter(
                                                                        (t2) =>
                                                                          t2.value !==
                                                                          t.value
                                                                      ),
                                                                  }
                                                                : s
                                                            )
                                                          );
                                                        }}
                                                      >
                                                        Löschen
                                                      </Button>
                                                    </FormControl>
                                                  </>
                                                ))}
                                                <Button
                                                  colorScheme="green"
                                                  onClick={() => {
                                                    setSteps(
                                                      steps.map((s) =>
                                                        s.step_title ===
                                                        step.step_title
                                                          ? {
                                                              ...s,
                                                              text_parts:
                                                                s.text_parts?.concat(
                                                                  {
                                                                    type: "TEXT",
                                                                    value:
                                                                      "Text " +
                                                                      randomInt(
                                                                        1000,
                                                                        9999
                                                                      ),
                                                                    id: randomInt(
                                                                      1000,
                                                                      9999
                                                                    ),
                                                                  }
                                                                ),
                                                            }
                                                          : s
                                                      )
                                                    );
                                                  }}
                                                >
                                                  Hinzufügen
                                                </Button>
                                              </Grid>
                                            </Box>
                                          </>
                                        )}
                                      </Box>
                                    </>
                                  )}
                                </Draggable>
                              </>
                            ))}
                          </Box>
                        </>
                      )}
                    </Droppable>
                  </DragDropContext>
                </>
              )}

              <Popover>
                <PopoverTrigger>
                  <Box
                    mt={8}
                    bgColor={"green.200"}
                    w={"100%"}
                    minH={"10vh"}
                    rounded={"xl"}
                    _hover={{
                      cursor: "pointer",
                      shadow: "2xl",
                      bgColor: "green.100",
                    }}
                    display={hidePlusButton ? "none" : "inherit"}
                  >
                    <Flex
                      w={"100%"}
                      h={"10vh"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      direction={"column"}
                    >
                      <FaPlus size={64} />
                    </Flex>
                  </Box>
                </PopoverTrigger>
                <PopoverContent bgColor={"black"}>
                  <PopoverArrow bgColor={"black"} />
                  <PopoverCloseButton />
                  <PopoverHeader>Neuer Schritt</PopoverHeader>
                  <PopoverBody>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();

                        const form = e.target as HTMLFormElement;

                        const data = new FormData(form);

                        const title = data.get("step_title") as string;
                        const type = data.get("new_step_step_type") as
                          | "MULTIPLE_CHOICE"
                          | "TEXT"
                          | "CODE_COMPARE"
                          | "CODE_CHECK";

                        // IF title EXISTS return
                        if (steps.find((step) => step.step_title === title))
                          return;

                        let step = {};

                        switch (type) {
                          case "MULTIPLE_CHOICE":
                            step = new Builders.MultipleChoiceBuilder()
                              .setTitle(title)
                              .setQuestion("Frage")
                              .addAnswer("Antwort 1", true)
                              .addAnswer("Antwort 2", false)
                              .addAnswer("Antwort 3", false)
                              .addAnswer("Antwort 4", false)
                              .build();
                            break;
                          case "TEXT":
                            step = new Builders.TextBuilder()
                              .setTitle(title)
                              .addText("Text " + randomInt(1000, 9999))
                              .addInput("Eingabe " + randomInt(1000, 9999))
                              .build();

                            // @ts-ignore
                            step.text_parts = step.text_parts?.map((t) => ({
                              ...t,
                              id: randomInt(1000, 9999),
                            }));
                            break;
                          case "CODE_COMPARE":
                            step = new Builders.CodeCompareBuilder()
                              .setTitle(title)
                              .setCodeA("Code A", true)
                              .setCodeB("Code B", false)
                              .setOutput("Ausgabe")
                              .build();
                            break;
                          case "CODE_CHECK":
                            step = new Builders.CodeCheckBuilder()
                              .setTitle(title)
                              .setCodeA("Code A", true)
                              .setCodeB("Code B", false)
                              .build();
                            break;
                          default:
                            console.log(type);
                            break;
                        }

                        // @ts-ignore
                        setSteps((prev) => [...prev, step]);

                        console.log(step);
                      }}
                    >
                      <Stack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>Titel</FormLabel>
                          <Input name={"step_title"} placeholder={"Titel"} />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>Typ</FormLabel>
                          <Select name={"new_step_step_type"}>
                            <option value="MULTIPLE_CHOICE">
                              Multiple Choice
                            </option>
                            <option value="TEXT">Text</option>
                            <option value="CODE_COMPARE">Code Vergleich</option>
                            <option value="CODE_CHECK">Code Check</option>
                          </Select>
                        </FormControl>
                        <Button colorScheme={"green"} type={"submit"}>
                          Hinzufügen
                        </Button>
                      </Stack>
                    </form>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
          </Flex>
        </Box>
      </Stack>
    </CreatorStudioLayout>
  );
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
