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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Head from "next/head";

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

  const router = useRouter();

  const { course: courseName } = router.query;
  const toast = useToast();

  React.useEffect(() => {
    if (courseName) {
      REST.Course.getCourse({
        course: courseName as string,
      }).then(async (res) => {
        if (res.status === 200) {
          setCourse(res.payload.course);

          let contents0 = [];
          for (const contentId of res.payload.course.contentPositions) {
            const res0 = await REST.Course.getSection({
              course: courseName as string,
              section: contentId,
            });

            if (res0.status === 200) {
              contents0.push(res0.payload.content);
            }
          }

          setContents(contents0);
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
            direction="column"
            alignItems="center"
            justifyContent="center"
            w="100%"
            h="100%"
            p={4}
          >
            <Image
              src={course.splashImage}
              alt={course.name}
              maxW={["100%", "35%"]}
              objectFit="cover"
              borderRadius="lg"
              boxShadow={"2xl"}
            />
            <Heading as="h1" fontSize={"6xl"} mt={4} fontFamily={"Seymour One"}>
              {course.name}
            </Heading>
            <Heading as="h2" fontSize="2xl" mt={4}>
              von&nbsp;
              <chakra.span color={"green.400"}>@{course.creator}</chakra.span>
            </Heading>
            <Text
              mt={4}
              fontSize={"3xl"}
              maxW={["100%", "35%"]}
              textAlign={"center"}
            >
              {course.description}
            </Text>
            <ButtonGroup mt={4}>
              <Button
                colorScheme="blue"
                size={"lg"}
                fontSize={"xl"}
                onClick={() => {
                  // COURSE PROGRESS
                  router.push(
                    `/course/${course.friendlyName}/${
                      // @ts-ignore
                      contents.find((c) => c._id === course.contentPositions[0])
                        ._id
                    }`
                  );
                }}
              >
                Beginnen
              </Button>
            </ButtonGroup>
            <Box mt={8} maxW={["100%", "35%"]} w={"100%"}>
              <Stack w={"100%"}>
                {contents.map((content) => (
                  <>
                    <Flex
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      p={4}
                      bg={"gray.900"}
                      w={"100%"}
                      cursor={"pointer"}
                      _hover={{
                        bg: "gray.700",
                      }}
                      onClick={() => {
                        router.push(
                          `/course/${course.friendlyName}/${content._id}`
                        );
                      }}
                    >
                      <Heading as="h3" fontSize={"2xl"} flex={"70%"}>
                        {content.displayName}
                      </Heading>
                      <Flex justifyContent={"space-between"} flex={"30%"}>
                        <Heading as="h3" fontSize={"2xl"}>
                          {content.quiz.length} Quiz Fragen
                        </Heading>
                      </Flex>
                    </Flex>
                    <StackDivider />
                  </>
                ))}
              </Stack>
            </Box>
          </Flex>
        </>
      ) : null}
    </>
  );
}
