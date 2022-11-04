/**
 * apps/web/src/pages/admin/contents/texts/[tid].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.11.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import REST from "@codeup/rest";
import AdminContentsLayout from "@codeup/components/admin/AdminContentsLayout";
import { useEffect, useState } from "react";
import { FaBookOpen, FaCheck, FaGlobe, FaTrash } from "react-icons/fa";
import dynamic from "next/dynamic";
const SimpleMdeReact = dynamic(import("react-simplemde-editor"), {
  ssr: false,
});
import "easymde/dist/easymde.min.css";
import AdminQuizMaker from "@codeup/components/admin/AdminQuizMaker";

export default function VideoViewer() {
  const router = useRouter();

  const [text, setText] = React.useState<{
    name: string;
    _id: string;
    course: string;
    friendlyName: string;
    content: string;
    quiz: {
      question: string;
      answers: {
        answer: string;
        correct: boolean;
      }[];
    }[];
    createdAt: string;
    __v: number;
  }>();
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (router.query.tid) {
      REST.Admin.getText({
        token: localStorage.getItem("token") as string,
        tid: router.query.tid as string,
      }).then((res) => {
        if (res.status === 200) {
          setText(res.payload.text);
          setLoaded(true);
          setQuizQuestions(res.payload.text.quiz);
          setTranscript(res.payload.text.content);
        } else {
          router.push("/admin/contents/texts");
        }
      });
    }
  }, [router]);

  const [courses, setCourses] = useState<string[]>([]);

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
    REST.Admin.listCourses(localStorage.getItem("token") as string, true).then(
      (res) => {
        setCourses(res.payload.courses);
      }
    );
  }, []);

  const [transcript, setTranscript] = useState<string>("");

  return (
    <>
      <AdminLayout>
        <AdminContentsLayout>
          {!loaded ? (
            <>
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
                  color="red.300"
                />
                <Heading size={"lg"} mt={4}>
                  Laden...
                </Heading>
              </Flex>
            </>
          ) : (
            <>
              <Box w={"full"} mt={"2rem"} p={"2rem"}>
                <Heading size={"lg"} mb={"2rem"}>
                  Text Bearbeiten
                </Heading>
                <Box w={["100%", "50%"]}>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      const data = new FormData(e.target as HTMLFormElement);

                      const title = data.get("title") as string;
                      const friendlyName = data.get("friendlyName") as string;
                      const quiz = quizQuestions;

                      const res = await REST.Admin.updateText({
                        token: localStorage.getItem("token") as string,
                        tid: router.query.tid as string,
                        update: {
                          name: title,
                          friendlyName,
                          content: transcript,
                          // @ts-ignore
                          quiz,
                        },
                      });

                      if (res.status === 200) {
                        router.push("/admin/contents/texts");
                      } else {
                        alert("Fehler beim Speichern!");
                      }
                    }}
                  >
                    <FormControl isRequired>
                      <FormLabel>Titel</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>
                          <FaBookOpen />
                        </InputLeftAddon>
                        <Input
                          type={"text"}
                          name={"title"}
                          placeholder={"Titel"}
                          required
                          defaultValue={text?.name}
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
                          placeholder={"URL Freundlicher Name"}
                          required
                          defaultValue={text?.friendlyName}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl mt={"2rem"} isRequired>
                      <FormLabel>Transkript / Beschreibung</FormLabel>
                      <SimpleMdeReact
                        value={transcript}
                        onChange={(e) => setTranscript(e)}
                      />
                    </FormControl>
                    <AdminQuizMaker
                      quizQuestions={quizQuestions}
                      setQuizQuestions={setQuizQuestions}
                    />
                    <ButtonGroup w={"100%"} mt={"2rem"}>
                      <Button
                        type={"submit"}
                        colorScheme={"green"}
                        flex={"100%"}
                        leftIcon={<FaCheck />}
                      >
                        Bestätigen
                      </Button>

                      <Button
                        colorScheme={"red"}
                        flex={"100%"}
                        leftIcon={<FaTrash />}
                        onClick={async () => {
                          if (
                            confirm("Soll das Video wirklich gelöscht werden?")
                          ) {
                            await REST.Admin.deleteVideo({
                              token: localStorage.getItem("token") as string,
                              vid: router.query.vid as string,
                            });

                            router.push("/admin/contents/videos");
                          }
                        }}
                      >
                        Löschen
                      </Button>
                    </ButtonGroup>
                  </form>
                </Box>
              </Box>
            </>
          )}
        </AdminContentsLayout>
      </AdminLayout>
    </>
  );
}
