/**
 * apps/web/src/pages/admin/contents/texts/new.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.10.2022
 *
 */

import * as React from "react";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import AdminContentsLayout from "@codeup/components/admin/AdminContentsLayout";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import { FaBookOpen, FaGlobe, FaTrash } from "react-icons/fa";
import REST from "@codeup/rest";
import { Promise } from "mongoose";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const SimpleMdeReact = dynamic(import("react-simplemde-editor"), {
  ssr: false,
});
import "easymde/dist/easymde.min.css";
import AdminQuizMaker from "@codeup/components/admin/AdminQuizMaker";

export default function New() {
  const router = useRouter();

  const [courses, setCourses] = useState<string[]>([]);

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
    REST.Admin.listCourses(localStorage.getItem("token") as string, true).then(
      (res) => {
        setCourses(res.payload.courses);
      }
    );
  }, []);
  const [description, setDescription] = useState<string>("");

  return (
    <>
      <AdminLayout>
        <AdminContentsLayout>
          <Box w={"full"} mt={"2rem"} p={"2rem"}>
            <Heading size={"lg"} mb={"2rem"}>
              Neuer Text
            </Heading>
            <Box w={["100%", "50%"]}>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const data = new FormData(e.target as HTMLFormElement);

                  const title = data.get("title") as string;
                  const friendlyName = data.get("friendlyName") as string;
                  const course = data.get("course") as string;
                  const quiz = quizQuestions;

                  const res = await REST.Admin.createText({
                    token: localStorage.getItem("token") as string,
                    title,
                    friendlyName,
                    course,
                    quiz,
                    content: description,
                  });

                  if (res.status === 200) {
                    router.push("/admin/contents/texts");
                  } else {
                    alert("Error. View console for more information.");
                    console.error(res);
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
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mt={"2rem"} isRequired>
                  <FormLabel>Kurs Zugehörigkeit</FormLabel>
                  <Select name={"course"}>
                    <option value={"__codeup.no_course"}>Kein Kurs</option>
                    {courses?.map((course: any) => (
                      <option value={course.id}>{course.name}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl mt={"2rem"} isRequired>
                  <FormLabel>Inhalt</FormLabel>
                  <SimpleMdeReact
                    value={description}
                    onChange={(e) => setDescription(e)}
                  />
                </FormControl>

                <AdminQuizMaker
                  quizQuestions={quizQuestions}
                  setQuizQuestions={setQuizQuestions}
                />
                <Button
                  type={"submit"}
                  colorScheme={"green"}
                  mt={"2rem"}
                  w={"100%"}
                >
                  Erstellen
                </Button>
              </form>
            </Box>
          </Box>
        </AdminContentsLayout>
      </AdminLayout>
    </>
  );
}
