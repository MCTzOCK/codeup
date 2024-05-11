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
  Image,
  InputLeftElement,
  ButtonGroup,
  useDisclosure,
} from "@chakra-ui/react";
import REST from "@codeup/rest";
import { FaArrowsAlt, FaCamera, FaCode, FaPlus, FaTrash } from "react-icons/fa";
import * as Builders from "@codeup/util/src/certificates/CertificateBuilder";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import Editor, { Monaco } from "@monaco-editor/react";
import html2canvas from "html2canvas";
import CodeUpModal from "@codeup/components/codeup/CodeUpModal";
import { editor } from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import Head from "next/head";
import AccountManager from "@codeup/util/dist/AccountManager";
import { CHeading } from "@codeup/components/dist/global/CHeading";

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
        token: AccountManager.getActiveToken(),
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
        screenshot: string;
        correct: boolean;
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
    if (courseid && course) {
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
    if (courseid && steps.length > 0 && course) {
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
        } else if (res.status !== 200) {
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [monacoHook, setMonacoHook] = React.useState<Monaco | null>(null);
  const [monacoEditorHook, setMonacoEditorHook] =
    React.useState<IStandaloneCodeEditor | null>(null);
  const [monacoEditorLanguage, setMonacoEditorLanguage] = React.useState<
    string | null
  >(null);
  const [monacoEditorContent, setMonacoEditorContent] =
    React.useState<string>("");

  return (
    <>
      <Head>
        <title>Zerifikat Editor - Creator Studio - CodeUp</title>
      </Head>
      <CreatorStudioLayout>
        <Box textAlign={"center"} pt={6}>
          <CHeading size={"xl"}>Zertifikatseditor</CHeading>
        </Box>

        <Stack w={"100%"} alignItems={"center"} justifyContent={"center"}>
          <Box w={["100%", "100%", "75%"]}>
            <Flex
              w={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
              direction={"column"}
            >
              <FormControl maxW={"50%"} mt={8}>
                <FormLabel>Mindestpunktzahl (in %)</FormLabel>
                <Box pt={6} pb={2}>
                  <Slider
                    aria-label="slider-ex-6"
                    value={minPercentage}
                    colorScheme={"brand"}
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
                      bg="brand.600"
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

              <Box w={"100%"}>
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

                        items.splice(
                          result.destination.index,
                          0,
                          reorderedItem
                        );

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
                                              step.step_type ===
                                              "MULTIPLE_CHOICE"
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
                                            {step.step_type ===
                                            "MULTIPLE_CHOICE"
                                              ? "Multiple Choice"
                                              : step.step_type === "TEXT"
                                              ? "Text"
                                              : step.step_type ===
                                                "CODE_COMPARE"
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
                                                                multiple_choice:
                                                                  {
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
                                                          Ist die Antwort
                                                          richtig?
                                                        </FormLabel>
                                                        <Switch
                                                          isChecked={
                                                            answer.correct
                                                          }
                                                          colorScheme={"brand"}
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
                                                                          (
                                                                            t2
                                                                          ) =>
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
                                                          colorScheme={"brand"}
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
                                                                          (
                                                                            t2
                                                                          ) =>
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
                                                                          (
                                                                            t2
                                                                          ) =>
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
                                                    variant={"brand"}
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
                                          {step.step_type ===
                                            "CODE_COMPARE" && (
                                            <>
                                              <Flex
                                                direction={"row"}
                                                w={"100%"}
                                                h={"fit-content"}
                                                paddingInline={10}
                                                paddingBlock={5}
                                                gap={40}
                                              >
                                                <Box flex={"100%"}>
                                                  <Image
                                                    src={
                                                      step.code_compare?.output
                                                    }
                                                    alt="Output"
                                                    _hover={{
                                                      opacity: 0.5,
                                                    }}
                                                    onClick={() => {
                                                      // upload an image
                                                      const input =
                                                        document.createElement(
                                                          "input"
                                                        );
                                                      input.type = "file";
                                                      input.accept = "image/*";
                                                      input.onchange = (e) => {
                                                        const base64EncodedImage =
                                                          (
                                                            (e.target as any)
                                                              .files as any
                                                          )[0];
                                                        const reader =
                                                          new FileReader();
                                                        reader.readAsDataURL(
                                                          base64EncodedImage
                                                        );
                                                        reader.onloadend =
                                                          () => {
                                                            setSteps(
                                                              // @ts-ignore
                                                              steps.map((s) =>
                                                                s.step_title ===
                                                                step.step_title
                                                                  ? {
                                                                      ...s,
                                                                      code_compare:
                                                                        {
                                                                          ...s.code_compare,
                                                                          output:
                                                                            reader.result,
                                                                        },
                                                                    }
                                                                  : s
                                                              )
                                                            );
                                                          };
                                                      };
                                                      input.click();
                                                    }}
                                                  />
                                                  <Image
                                                    src={
                                                      step.code_compare?.code_a
                                                        .screenshot
                                                    }
                                                    alt="Code A"
                                                    _hover={{
                                                      opacity: 0.5,
                                                    }}
                                                    onClick={() => {
                                                      // @ts-ignore
                                                      window._temp_screenShot_callback =
                                                        (data: string) => {
                                                          // @ts-ignore
                                                          delete window._temp_screenShot_callback;
                                                          console.log(2);
                                                          setSteps(
                                                            // @ts-ignore
                                                            steps.map((s) =>
                                                              s.step_title ===
                                                              step.step_title
                                                                ? {
                                                                    ...s,
                                                                    code_compare:
                                                                      {
                                                                        ...s.code_compare,
                                                                        code_a:
                                                                          {
                                                                            ...s
                                                                              .code_compare
                                                                              ?.code_a,
                                                                            screenshot:
                                                                              data,
                                                                          },
                                                                      },
                                                                  }
                                                                : s
                                                            )
                                                          );
                                                        };
                                                      onOpen();
                                                      setMonacoEditorContent(
                                                        ""
                                                      );
                                                    }}
                                                  />
                                                  <Image
                                                    src={
                                                      step.code_compare?.code_b
                                                        .screenshot
                                                    }
                                                    alt="Code B"
                                                    _hover={{
                                                      opacity: 0.5,
                                                    }}
                                                    onClick={() => {
                                                      // @ts-ignore
                                                      window._temp_screenShot_callback =
                                                        (data: string) => {
                                                          // @ts-ignore
                                                          delete window._temp_screenShot_callback;
                                                          console.log(2);
                                                          setSteps(
                                                            // @ts-ignore
                                                            steps.map((s) =>
                                                              s.step_title ===
                                                              step.step_title
                                                                ? {
                                                                    ...s,
                                                                    code_compare:
                                                                      {
                                                                        ...s.code_compare,
                                                                        code_b:
                                                                          {
                                                                            ...s
                                                                              .code_compare
                                                                              ?.code_b,
                                                                            screenshot:
                                                                              data,
                                                                          },
                                                                      },
                                                                  }
                                                                : s
                                                            )
                                                          );
                                                        };
                                                      onOpen();
                                                      setMonacoEditorContent(
                                                        ""
                                                      );
                                                    }}
                                                  />
                                                  <ButtonGroup
                                                    mt={2}
                                                    w={"100%"}
                                                  >
                                                    <Button
                                                      variant={"brand"}
                                                      w={"100%"}
                                                      maxW={"600px"}
                                                      onClick={() => {
                                                        setSteps(
                                                          // @ts-ignore
                                                          steps.map((s) =>
                                                            s.step_title ===
                                                            step.step_title
                                                              ? {
                                                                  ...s,
                                                                  code_compare:
                                                                    {
                                                                      ...s.code_compare,
                                                                      code_a: {
                                                                        ...s
                                                                          .code_compare
                                                                          ?.code_a,
                                                                        correct:
                                                                          !s
                                                                            .code_compare
                                                                            ?.code_a
                                                                            .correct,
                                                                      },
                                                                      code_b: {
                                                                        ...s
                                                                          .code_compare
                                                                          ?.code_b,
                                                                        correct:
                                                                          !s
                                                                            .code_compare
                                                                            ?.code_b
                                                                            .correct,
                                                                      },
                                                                    },
                                                                }
                                                              : s
                                                          )
                                                        );
                                                      }}
                                                    >
                                                      Richtig:&nbsp;
                                                      {step.code_compare?.code_a
                                                        .correct
                                                        ? "A"
                                                        : "B"}
                                                    </Button>
                                                  </ButtonGroup>
                                                </Box>
                                              </Flex>
                                            </>
                                          )}
                                          {step.step_type === "CODE_CHECK" && (
                                            <>
                                              <Flex
                                                direction={"row"}
                                                w={"100%"}
                                                h={"fit-content"}
                                                paddingInline={10}
                                                paddingBlock={5}
                                                gap={40}
                                              >
                                                <Box flex={"100%"}>
                                                  <Image
                                                    src={
                                                      step.code_check
                                                        ?.screenshot
                                                    }
                                                    alt="Code"
                                                    _hover={{
                                                      opacity: 0.5,
                                                    }}
                                                    onClick={() => {
                                                      // @ts-ignore
                                                      window._temp_screenShot_callback =
                                                        (data: string) => {
                                                          // @ts-ignore
                                                          delete window._temp_screenShot_callback;
                                                          console.log(2);
                                                          setSteps(
                                                            // @ts-ignore
                                                            steps.map((s) =>
                                                              s.step_title ===
                                                              step.step_title
                                                                ? {
                                                                    ...s,
                                                                    code_check:
                                                                      {
                                                                        correct:
                                                                          s
                                                                            .code_check
                                                                            ?.correct,
                                                                        screenshot:
                                                                          data,
                                                                      },
                                                                  }
                                                                : s
                                                            )
                                                          );
                                                        };
                                                      onOpen();
                                                      setMonacoEditorContent(
                                                        ""
                                                      );
                                                    }}
                                                  />
                                                  <ButtonGroup
                                                    mt={2}
                                                    w={"100%"}
                                                  >
                                                    <Button
                                                      colorScheme={
                                                        step.code_check?.correct
                                                          ? "green"
                                                          : "red"
                                                      }
                                                      w={"100%"}
                                                      maxW={"600px"}
                                                      onClick={() => {
                                                        setSteps(
                                                          // @ts-ignore
                                                          steps.map((s) =>
                                                            s.step_title ===
                                                            step.step_title
                                                              ? {
                                                                  ...s,
                                                                  code_check: {
                                                                    screenshot:
                                                                      s
                                                                        .code_check
                                                                        ?.screenshot,
                                                                    correct:
                                                                      !s
                                                                        .code_check
                                                                        ?.correct,
                                                                  },
                                                                }
                                                              : s
                                                          )
                                                        );
                                                      }}
                                                    >
                                                      {step.code_check?.correct
                                                        ? "Richtig"
                                                        : "Falsch"}
                                                    </Button>
                                                  </ButtonGroup>
                                                </Box>
                                              </Flex>
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

                <CodeUpModal
                  onOpen={onOpen}
                  onClose={onClose}
                  isOpen={isOpen}
                  title={"Code Block Erstellen"}
                  customSize={["6xl"]}
                >
                  <Box w={"100%"} minH={"40vh"} h={"fit-content"}>
                    {!monacoEditorLanguage && (
                      <InputGroup w={"100%"} overflow={"auto"} mb={"2rem"}>
                        <InputLeftElement>
                          <FaCode />
                        </InputLeftElement>
                        <Input
                          placeholder={"Programmiersprache eingeben..."}
                          w={"100%"}
                          id={"codeup-code-block-language"}
                        />
                        <Button
                          ml={2}
                          variant={"brand"}
                          boxShadow={"2xl"}
                          onClick={() => {
                            // remove monaco editor if exists
                            if (monacoEditorHook) {
                              monacoEditorHook.dispose();
                            }

                            // set language
                            setMonacoEditorLanguage(
                              (
                                document.getElementById(
                                  "codeup-code-block-language"
                                ) as HTMLInputElement
                              )?.value || ""
                            );
                          }}
                        >
                          Erstellen
                        </Button>
                      </InputGroup>
                    )}
                    {monacoEditorLanguage && (
                      <>
                        <Box id={"codeup_code_image_creator_monaco"}>
                          <Editor
                            defaultLanguage={monacoEditorLanguage}
                            defaultValue={monacoEditorContent}
                            onMount={(editor, monaco) => {
                              if (editor && monaco) {
                                setMonacoHook(monaco);
                                setMonacoEditorHook(editor);
                              }
                            }}
                            onChange={(value, ev) => {
                              setMonacoEditorContent(value || "");
                            }}
                            theme={"vs-dark"}
                            height={"40vh"}
                            options={{
                              fontSize: 20,
                              minimap: {
                                enabled: false,
                              },
                              scrollbar: {
                                scrollByPage: true,
                              },
                            }}
                          />
                        </Box>
                      </>
                    )}
                    {monacoEditorLanguage && (
                      <ButtonGroup w={"100%"} mt={"2rem"}>
                        <Button
                          leftIcon={<FaArrowsAlt />}
                          w={"100%"}
                          colorScheme={"red"}
                          onClick={() => {
                            setMonacoEditorLanguage(null);
                          }}
                        >
                          Sprache wechseln
                        </Button>
                        <Button
                          variant={"brand"}
                          w={"100%"}
                          leftIcon={<FaCamera />}
                          onClick={async () => {
                            const i = await html2canvas(
                              document.getElementsByClassName(
                                "monaco-editor"
                              )[0] as HTMLElement
                            );

                            // @ts-ignore
                            window._temp_screenShot_callback(
                              i.toDataURL("image/png")
                            );

                            onClose();
                          }}
                        >
                          Screenshots erstellen
                        </Button>
                      </ButtonGroup>
                    )}
                  </Box>
                </CodeUpModal>

                <Popover>
                  <PopoverTrigger>
                    <Flex
                      w={"100%"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <Box
                        mt={8}
                        mb={8}
                        bgColor={"gray.900"}
                        w={"100%"}
                        maxW={"600px"}
                        minH={"10vh"}
                        rounded={"xl"}
                        cursor={"pointer"}
                        display={hidePlusButton ? "none" : "inherit"}
                      >
                        <Flex
                          w={"100%"}
                          h={"10vh"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          direction={"column"}
                          color={"brand.500"}
                        >
                          <FaPlus size={64} />
                        </Flex>
                      </Box>
                    </Flex>
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
                              <option value="CODE_COMPARE">
                                Code Vergleich
                              </option>
                              <option value="CODE_CHECK">Code Check</option>
                            </Select>
                          </FormControl>
                          <Button variant={"brand"} type={"submit"}>
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
    </>
  );
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
