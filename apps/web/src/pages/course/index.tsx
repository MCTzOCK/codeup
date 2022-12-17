/**
 * apps/web/src/pages/course/index.tsx
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
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";
import Head from "next/head";

export default function Index() {
  const [courses, setCourses] = React.useState<
    {
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
    }[]
  >([]);

  const [filteredCourses, setFilteredCourses] = React.useState<
    {
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
    }[]
  >([]);

  const toast = useToast();
  const router = useRouter();

  React.useEffect(() => {
    REST.Course.listCourses().then((res) => {
      if (res.status === 200) {
        setCourses(res.payload.courses);
        setFilteredCourses(res.payload.courses);
      } else {
        toast({
          title: "Fehler",
          description: "Es ist ein Fehler aufgetreten",
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "bottom-right",
        });
      }
    });
  }, [toast]);

  return (
    <>
      <Head>
        <title>Kursübersicht - CodeUp</title>
      </Head>
      <Flex
        direction="column"
        w={"100%"}
        justifyContent="center"
        gap={"2rem"}
        mt={"2rem"}
        alignItems={"center"}
      >
        <Flex
          w={"100%"}
          h={"fit-content"}
          direction={"column"}
          alignItems={"center"}
          mt={"4rem"}
        >
          <Heading
            fontSize={["3xl", "6xl"]}
            color={"white"}
            textAlign={"center"}
            fontWeight={"bold"}
            fontFamily={"Seymour One"}
            maxW={["75%", "50%"]}
            textShadow={"0px 10px 100px #000000"}
          >
            Kurse
          </Heading>
          <Text fontSize={["xl", "2xl"]} textAlign={["center", "initial"]}>
            Aktuell bieten wir&nbsp;
            <b>
              {courses.length} Kurs
              {courses.length !== 1 ? "e" : ""}
            </b>
            &nbsp;mit insgesamt&nbsp;
            <b>
              {courses
                .map((course) => course.contentPositions.length)
                .reduce((a, b) => a + b, 0)}
              &nbsp;Lektion
              {courses
                .map((course) => course.contentPositions.length)
                .reduce((a, b) => a + b, 0) !== 1
                ? "en"
                : ""}
            </b>
            &nbsp;an.
          </Text>
          <InputGroup
            w={["75%", "50%"]}
            mt={"2rem"}
            maxW={["75%", "50%"]}
            boxShadow={"xl"}
          >
            <InputLeftElement pointerEvents="none">
              <FaSearch />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Kurse durchsuchen"
              fontSize={"xl"}
              onChange={(e) => {
                setFilteredCourses(
                  courses.filter(
                    (course) =>
                      course.name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                      course.friendlyName
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                      course.description
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                  )
                );
              }}
            />
          </InputGroup>
        </Flex>
        <Grid
          templateColumns={
            filteredCourses.length > 0
              ? ["repeat(1, 1fr)", "repeat(3, 1fr)"]
              : "repeat(1, 1fr)"
          }
          gap={6}
          w={"100%"}
          justifyContent="center"
          alignItems={"center"}
          h={"fit-content"}
        >
          {filteredCourses.map((c) => (
            <>
              <GridItem m={8}>
                <Box
                  bg={"gray.900"}
                  color={"white"}
                  rounded={"lg"}
                  p={6}
                  h={"100%"}
                  cursor={"pointer"}
                  _hover={{
                    shadow: "2xl",
                  }}
                  onClick={() => {
                    router.push(`/course/${c.friendlyName}`);
                  }}
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
                      size={"xl"}
                      color={"white"}
                      fontWeight={"bold"}
                      textAlign={"left"}
                      mt={4}
                    >
                      {c.name}
                    </Heading>
                    <Text fontSize={"xl"} color={"gray.400"} textAlign={"left"}>
                      von&nbsp;
                      <chakra.span color={"green.400"}>
                        @{c.creator}
                      </chakra.span>
                    </Text>
                    <Heading
                      size={"lg"}
                      color={"gray.400"}
                      fontWeight={"normal"}
                      textAlign={"left"}
                    >
                      {c.description}
                    </Heading>
                    <Text fontSize={"xl"} color={"gray.400"} textAlign={"left"}>
                      {c.contentPositions.length} Lektion
                      {c.contentPositions.length !== 1 ? "en" : ""}
                    </Text>
                  </Flex>
                </Box>
              </GridItem>
            </>
          ))}
        </Grid>
        {filteredCourses.length === 0 ? (
          <>
            <Heading
              size={"md"}
              color={"gray.400"}
              fontWeight={"normal"}
              textAlign={"center"}
            >
              Keine Kurse gefunden
            </Heading>
          </>
        ) : null}
      </Flex>
    </>
  );
}
