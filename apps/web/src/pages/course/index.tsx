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
import AccountManager from "@codeup/util/dist/AccountManager";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { CHeading } from "@codeup/components/dist/global/CHeading";

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

  const [coursesLoading, setCoursesLoading] = React.useState<boolean>(true);

  const toast = useToast();
  const router = useRouter();

  React.useEffect(() => {
    REST.Course.listCourses({
      token: AccountManager.getActiveToken(),
    }).then((res) => {
      if (res.status === 200) {
        setCourses(res.payload.courses);
        setFilteredCourses(res.payload.courses);
        setCoursesLoading(false);
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
        h={"fit-content"}
        minH={"100vh"}
        bg={"#000"}
      >
        <Flex
          w={"100%"}
          h={"fit-content"}
          direction={"column"}
          alignItems={"center"}
          mt={4}
        >
          <Box textAlign={"center"}>
            <CHeading size={"3xl"}>Kurse</CHeading>
          </Box>
          <Text fontSize={["xl", "2xl"]} textAlign={["center", "initial"]}>
            Aktuell werden&nbsp;
            <chakra.b color={"brand.500"}>
              {courses.length} Kurs
              {courses.length !== 1 ? "e" : ""}
            </chakra.b>
            &nbsp;mit insgesamt&nbsp;
            <chakra.b color={"brand.500"}>
              {courses
                .map((course) => course.contentPositions.length)
                .reduce((a, b) => a + b, 0)}
              &nbsp;Lektion
              {courses
                .map((course) => course.contentPositions.length)
                .reduce((a, b) => a + b, 0) !== 1
                ? "en"
                : ""}
            </chakra.b>
            &nbsp;angeboten.
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
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
            "repeat(4, 1fr)",
            "repeat(5, 1fr)",
          ]}
          p={4}
          w={"100%"}
          justifyContent="center"
          alignItems={"center"}
          h={"fit-content"}
        >
          {filteredCourses.map((c) => (
            <>
              <GridItem h={"100%"} p={4}>
                <Box
                  bg={"gray.900"}
                  color={"white"}
                  rounded={"xl"}
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
                      w={"100%"}
                      h={"150px"}
                    />
                    <CHeading size={"xl"}>{c.name}</CHeading>
                    <Text fontSize={"xl"} color={"gray.300"} textAlign={"left"}>
                      von&nbsp;
                      <chakra.span color={"brand.400"}>
                        @{c.creator}
                      </chakra.span>
                    </Text>
                    <Heading
                      size={"lg"}
                      color={"gray.300"}
                      fontWeight={"normal"}
                      textAlign={"left"}
                    >
                      {c.description.substring(0, 100)}
                      ...
                    </Heading>
                    <Text fontSize={"xl"} color={"gray.300"} textAlign={"left"}>
                      {c.contentPositions.length} Lektion
                      {c.contentPositions.length !== 1 ? "en" : ""}
                    </Text>
                  </Flex>
                </Box>
              </GridItem>
            </>
          ))}
        </Grid>
        {filteredCourses.length === 0 && !coursesLoading ? (
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
        {coursesLoading && (
          <>
            <AuthenticateLoadingIndicator text={"Lade Kurse..."} />
          </>
        )}
      </Flex>
    </>
  );
}
