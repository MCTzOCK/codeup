/**
 * apps/web/src/pages/courses/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.09.2022
 *
 */

import * as React from "react";
import { useEffect } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  Heading,
} from "@chakra-ui/react";
import Link from "next/link";
import HTMLCourseSections from "@codeup/components/course/HTMLCourseSections";

export default function Index() {
  interface x {
    name: string;
    image: string;
    description: string;
    url: string;
  }

  const courses: x[] = [
    {
      name: "HTML Basics",
      image: "/_static/images/courses/splashes/html-basics.svg",
      description:
        "Mit HTML werden Webseiten erstellt. In diesem Kurs lernst du die Grundlagen von HTML.",
      url: "/course/html-basics/basics",
    },
  ];

  useEffect(() => {
    courses.forEach((course) => {
      window.dispatchEvent(
        new CustomEvent(
          "codeup::courses:toggle_s_button?" +
            course.name.toLowerCase().replace(" ", "_")
        )
      );
    });
  }, []);

  return (
    <>
      <Flex
        direction="column"
        w={"100%"}
        justifyContent="center"
        gap={"2rem"}
        alignItems={"center"}
        mt={"2rem"}
      >
        {courses.map((course) => {
          return (
            <>
              <Box
                bg="white"
                p={[0, "2rem"]}
                _dark={{
                  bg: "gray.900",
                }}
                display={["initial", "flex"]}
                w={["100%", "75%"]}
                shadow={"xl"}
                rounded={"lg"}
              >
                <Box w={"100%"}>
                  <Box
                    h={{
                      base: 64,
                      lg: "full",
                    }}
                    rounded={{
                      lg: "lg",
                    }}
                    bgSize="cover"
                    style={{
                      backgroundImage: "url('" + course.image + "')",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  />
                </Box>

                <Box py={12} px={6} w={"100%"}>
                  <Heading fontSize={"3xl"} fontWeight="bold">
                    {course.name}
                  </Heading>
                  <chakra.p mt={4} color="gray">
                    {course.description}
                  </chakra.p>

                  <Box mt={8}>
                    <ButtonGroup>
                      <Link href={course.url}>
                        <Button colorScheme="whatsapp" size="lg">
                          Kurs öffnen
                        </Button>
                      </Link>
                      <Button
                        colorScheme="linkedin"
                        size="lg"
                        onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent(
                              "codeup::courses:open_sections?" +
                                course.name.toLowerCase().replace(" ", "_")
                            )
                          );
                        }}
                      >
                        Lektionen
                      </Button>
                    </ButtonGroup>
                  </Box>
                </Box>
              </Box>
            </>
          );
        })}
      </Flex>
      <HTMLCourseSections />
    </>
  );
}
