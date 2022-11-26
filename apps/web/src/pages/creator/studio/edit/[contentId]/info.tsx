/**
 * apps/web/src/pages/creator/studio/edit/[contentId]/info.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.11.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import REST from "@codeup/rest";
import CreatorStudioLayout from "@codeup/components/creator/studio/CreatorStudioLayout";
import { FaPen } from "react-icons/fa";
import AdminQuizMaker from "@codeup/components/admin/AdminQuizMaker";

export default function Info() {
  const router = useRouter();

  const { contentId } = router.query;

  const [content, setContent] = React.useState<{
    _id: string;
    displayName: string;
    course: string;
    url: string;
    textContent: string;
    videoUrl: string;
    quiz: {
      question: string;
      answers: {
        answer: string;
        correct: boolean;
      }[];
    };
  }>();

  const toast = useToast();

  const [quiz, setQuiz] = React.useState<
    {
      question: string;
      answers: {
        answer: string;
        correct: boolean;
      }[];
    }[]
  >([]);

  useEffect(() => {
    if (contentId) {
      REST.Creator.getContents({
        token: localStorage.getItem("token") as string,
        contentId: contentId as string,
      }).then((res) => {
        if (res.status === 200) {
          setContent(res.payload.content);
          setQuiz(res.payload.content.quiz);
        } else {
          toast({
            title: "Fehler",
            description: "Fehler beim Laden: " + res.payload.error,
            status: "error",
            duration: 1500,
            isClosable: true,
            position: "bottom-left",
          });
        }
      });
    }
  }, [contentId]);

  return (
    <CreatorStudioLayout>
      <Heading mt={"2rem"} size="2xl" textAlign={"center"}>
        Bearbeiten
      </Heading>
      {content ? (
        <>
          <Flex
            flexDir="column"
            width="100%"
            p={"5rem"}
            minH={"100vh"}
            alignItems={"center"}
          >
            <Flex flexDir="column" width={["100", "35%"]}>
              <Stack spacing={4} width={"100%"}>
                <FormControl id="displayName">
                  <FormLabel>Anzeigename</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <FaPen />
                    </InputLeftElement>
                    <Input
                      name={"displayName"}
                      defaultValue={content.displayName}
                      placeholder={"Name"}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl id="url">
                  <FormLabel>URL</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <FaPen />
                    </InputLeftElement>
                    <Input
                      name={"url"}
                      defaultValue={content.url}
                      placeholder={"URL"}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl id="url">
                  <FormLabel>Video-URL</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <FaPen />
                    </InputLeftElement>
                    <Input
                      name={"video-url"}
                      defaultValue={content.videoUrl}
                      placeholder={"Video-URL"}
                    />
                  </InputGroup>
                </FormControl>
                <AdminQuizMaker
                  quizQuestions={quiz}
                  setQuizQuestions={setQuiz}
                />
              </Stack>
            </Flex>
            <ButtonGroup
              mt={"2rem"}
              w={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Button
                fontSize={"2xl"}
                size={"lg"}
                colorScheme={"red"}
                onClick={() => {
                  router.back();
                }}
              >
                Abbrechen
              </Button>
              <Button
                fontSize={"2xl"}
                size={"lg"}
                colorScheme={"green"}
                onClick={async () => {
                  const displayName = document.querySelector(
                    "input[name=displayName]"
                  ) as HTMLInputElement;
                  const url = document.querySelector(
                    "input[name=url]"
                  ) as HTMLInputElement;
                  const videoUrl = document.querySelector(
                    "input[name=video-url]"
                  ) as HTMLInputElement;

                  const res = await REST.Creator.updateContent({
                    token: localStorage.getItem("token") as string,
                    cid: content._id,
                    update: {
                      displayName: displayName.value || content.displayName,
                      url: url.value || content.url,
                      quiz: quiz || content.quiz,
                      videoUrl: videoUrl.value || content.videoUrl,
                    },
                  });

                  if (res.status === 200) {
                    router.back();
                  } else {
                    toast({
                      title: "Fehler",
                      description:
                        "Fehler beim Speichern: " + res.payload.error,
                      status: "error",
                      duration: 1500,
                      isClosable: true,
                      position: "bottom-left",
                    });
                  }
                }}
              >
                Speichern
              </Button>
            </ButtonGroup>
          </Flex>
        </>
      ) : null}
    </CreatorStudioLayout>
  );
}
