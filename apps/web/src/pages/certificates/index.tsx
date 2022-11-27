/**
 * apps/web/src/pages/certificates/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.11.2022
 *
 */

import * as React from "react";
import REST from "@codeup/rest";
import {
  Box,
  chakra,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useLoggedIn } from "@codeup/hooks";

export default function Index() {
  const [certificates, setCertificates] = React.useState<string[]>([]);
  const [courses, setCourses] = React.useState<any[]>([]);

  const toast = useToast();

  const { userInfo, loggedIn, loaded } = useLoggedIn();
  useEffect(() => {
    if (loaded && !loggedIn) {
      router.push("/");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    }
  }, [userInfo, loggedIn, loaded]);

  React.useEffect(() => {
    REST.Course.listCourses().then(async (res) => {
      if (res.status === 200) {
        const courses = [];
        const certs = [];

        for (const course of res.payload.courses) {
          const r1 = await REST.Certificates.getCertificate({
            token: localStorage.getItem("token") as string,
            onlyLookup: true,
            course: course._id,
          });

          if (r1.status === 200) {
            courses.push(course);
            certs.push(r1.payload);
          }
        }

        // @ts-ignore
        setCertificates(certs);
        setCourses(courses);
      } else {
        toast({
          title: "Fehler",
          description: "Es ist ein Fehler aufgetreten: " + res.payload.error,
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "bottom-left",
        });
      }
    });
  }, []);

  const router = useRouter();

  return (
    <>
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
            Zertifikate
          </Heading>
          <Text fontSize={["xl", "2xl"]}>
            Aktuell kannst du in folgenden Kursen ein Zertifikat erhalten:
          </Text>
        </Flex>
        <Grid
          templateColumns={
            courses.length > 0
              ? ["repeat(1, 1fr)", "repeat(3, 1fr)"]
              : "repeat(1, 1fr)"
          }
          gap={6}
          w={"100%"}
          justifyContent="center"
          alignItems={"center"}
          h={"fit-content"}
        >
          {courses.map((c) => (
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
                    router.push("/certificates/" + c._id);
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
                  </Flex>
                </Box>
              </GridItem>
            </>
          ))}
        </Grid>
        {courses.length === 0 ? (
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
