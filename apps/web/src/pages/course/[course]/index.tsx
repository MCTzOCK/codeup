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
} from "@chakra-ui/react";
import { useRouter } from "next/router";

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
            <Heading as="h1" size="2xl" mt={4}>
              {course.name}
            </Heading>
            <Text mt={4}>{course.description}</Text>
            <ButtonGroup mt={4}>
              <Button
                colorScheme="blue"
                onClick={() => {
                  router.push(`/course/${course.friendlyName}/register`);
                }}
              >
                Kurs beitreten
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  router.push(`/course/${course.friendlyName}/login`);
                }}
              >
                Kurs beitreten
              </Button>
            </ButtonGroup>
            <Box mt={4}>
              <Heading as="h2" size="xl">
                Inhalte
              </Heading>
              <Grid
                templateColumns={["repeat(1, 1fr)", "repeat(3, 1fr)"]}
                gap={6}
                mt={4}
              >
                {contents.map((content) => (
                  <GridItem key={content._id}>
                    <Box
                      p={4}
                      borderRadius="lg"
                      bg={"gray.900"}
                      w={"100%"}
                      cursor={"pointer"}
                      _hover={{
                        boxShadow: "2xl",
                      }}
                    >
                      <Heading as="h3" size="lg">
                        {content.displayName}
                      </Heading>
                      <Text mt={4}>
                        <Badge
                          fontSize={"xl"}
                          colorScheme={
                            content.type === "VIDEO" ? "green" : "red"
                          }
                        >
                          {content.type === "VIDEO" ? "Video" : "Text"}
                        </Badge>
                        <br />
                        Quiz: {content.quiz.length} Fragen
                      </Text>
                    </Box>
                  </GridItem>
                ))}
              </Grid>
            </Box>
          </Flex>
        </>
      ) : null}
    </>
  );
}
