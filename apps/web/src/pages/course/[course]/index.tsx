/**
 * apps/web/src/pages/course/[course]/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.11.2022
 *
 */

import * as React from "react";
import REST from "@codeup/rest";
import {
  useToast,
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  Heading,
  Image,
  Text,
  Grid,
  GridItem,
  Link,
  Input,
  Badge,
  Stack,
  StackDivider,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Head from "next/head";
import AccountManager from "@codeup/util/dist/AccountManager";
import Milestones from "@codeup/components/landingpage/Milestones";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";

export default function Index() {
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

  const [contents, setContents] = React.useState<
    {
      _id: string;
      displayName: string;
      url: string;
      course: string;
      createdAt: string;
      type: "VIDEO" | "TEXT";
      textContent: string;
      quiz: any[];
      videoUrl: string;
    }[]
  >([]);
  const [contentsLoading, setContentsLoading] = React.useState<boolean>(true);

  const router = useRouter();

  const { course: courseName } = router.query;
  const toast = useToast();

  React.useEffect(() => {
    if (courseName) {
      REST.Course.getCourse({
        course: courseName as string,
        token: AccountManager.getActiveToken(),
      }).then(async (res) => {
        if (res.status === 200) {
          setCourse(res.payload.course);

          let contents0 = [];
          for (const contentId of res.payload.course.contentPositions) {
            const res0 = await REST.Course.getSection({
              course: courseName as string,
              section: contentId,
              token: AccountManager.getActiveToken(),
            });

            if (res0.status === 200) {
              contents0.push(res0.payload.content);
            }
          }

          setContents(contents0);
          setContentsLoading(false);
        } else {
          toast({
            title: "Error",
            description: "Der Kurs konnte nicht geladen werden",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      });
    }
  }, [courseName]);

  return (
    <>
      <Head>
        <title>{course ? course.name : "Kursübersicht"} - CodeUp</title>
      </Head>
      {course ? (
        <>
          <Flex
            direction={"column"}
            mt={"2rem"}
            justifyContent={"center"}
            alignItems={"center"}
            w={"100%"}
            minH={"100%"}
            h={"fit-content"}
          >
            <Box
              w={["100%", "75%"]}
              backgroundColor={"black"}
              p={4}
              rounded={"xl"}
              boxShadow={"xl"}
            >
              <Heading size={"2xl"} mb={6}>
                {course.name} von @{course.creator}
              </Heading>
              <Divider />
              <Flex direction={["column", "row"]} w={"100%"} mt={6}>
                <Box flex={"100%"}>
                  <Image
                    src={course.splashImage}
                    alt={course.name}
                    w={["100%", "75%"]}
                    maxH={"300px"}
                    objectFit="cover"
                    borderRadius="lg"
                    boxShadow={"2xl"}
                  />
                  <Text mt={4} fontSize={"lg"}>
                    <b>Beschreibung</b>
                    <br />
                    {course.description}
                  </Text>
                </Box>
                <Box flex={"100%"}>
                  <Milestones
                    milestones={contents.map((content) => {
                      return {
                        title: content.displayName,
                        date: new Date(content.createdAt).toLocaleDateString(),
                        description:
                          "Diese Lektion enthält " +
                          content.quiz.length +
                          " Quizfragen.",
                        cursor: "pointer",
                        onClick: () => {
                          router.push(
                            "/course/" + course.friendlyName + "/" + content._id
                          );
                        },
                      };
                    })}
                    title={"Lektionen"}
                  />
                  {contentsLoading && (
                    <>
                      <AuthenticateLoadingIndicator text={"Lade Inhalte..."} />
                    </>
                  )}
                </Box>
              </Flex>
            </Box>
          </Flex>
        </>
      ) : null}
    </>
  );
}
