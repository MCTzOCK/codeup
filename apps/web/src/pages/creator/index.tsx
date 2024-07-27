/**
 * apps/web/src/pages/creator/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.05.2024
 *
 */

import * as React from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Image,
  Text,
  Box,
  Grid,
  Avatar,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function Index() {
  const router = useRouter();
  const [topCreators, setTopCreators] = React.useState<
    {
      _id: string;
      count: number;
    }[]
  >([]);

  useEffect(() => {
    REST.Creator.getTopCreators().then((res) => {
      if (res.status === 200) {
        setTopCreators(res.payload.creators);
      }
    });
  }, []);

  const { t } = useTranslation("creator");

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      <Box bg={"#000"}>
        <Flex w={"100%"} minH={"100vh"} h={"fit-content"} bg={"#000"}>
          <Flex
            w={"100%"}
            h={"fit-content"}
            p={[5, 10, 20]}
            direction={["column", "column", "row"]}
            alignItems={"center"}
            minH={"100vh"}
            zIndex={2}
          >
            <Flex
              flex={["100%", "100%", "100%"]}
              alignItems={"center"}
              w={"100%"}
              justifyContent={"center"}
            >
              <Flex gap={2} pt={10} direction={"column"}>
                <Heading
                  as={"h3"}
                  fontSize={["2xl", "3xl", "4xl"]}
                  color={"gray.300"}
                  fontWeight={1000}
                  letterSpacing={-2}
                >
                  {t("subtitle")}
                </Heading>
                <Heading
                  as={"h1"}
                  fontSize={["4xl", "5xl", "8xl"]}
                  fontWeight={900}
                  letterSpacing={-2}
                  fontFamily={"Jetbrains Mono ExtraBold"}
                  color={"brand.500"}
                >
                  {t("title")}
                </Heading>
                <Text fontWeight={100} fontSize={["xl", "2xl", "4xl"]}>
                  {t("s0")}
                  <br />
                  {t("s1")}
                  <br />
                  {t("s2")}
                  <br />
                  {t("s3")}
                  <br />
                  {t("s4")}
                </Text>
                <ButtonGroup spacing={4} mt={2}>
                  <Button
                    rounded={"md"}
                    variant={"brand"}
                    fontSize={"xl"}
                    size={"lg"}
                    color={"black"}
                    onClick={() => {
                      router.push("/codeup/contact?creator=true");
                    }}
                  >
                    {t("apply")}
                  </Button>
                  <Button
                    rounded={"md"}
                    fontSize={"xl"}
                    size={"lg"}
                    onClick={() => {
                      router.push("/creator/studio");
                    }}
                  >
                    {t("studio")}
                  </Button>
                </ButtonGroup>
              </Flex>
            </Flex>
            <Flex
              alignItems={"center"}
              justifyContent={"center"}
              w={"100%"}
              h={"100%"}
            >
              <Image
                src={"/_static/images/showcase/framed_course.png"}
                alt={"Software Developer"}
                w={"100%"}
                h={"100%"}
                objectFit={"cover"}
                objectPosition={"center"}
                borderRadius={"lg"}
                maxW={["400px", "500px", "1000px"]}
                shadow={"xl"}
              />
            </Flex>
          </Flex>
        </Flex>
        <Box h={"fit-content"}>
          <Box textAlign={"center"}>
            <CHeading>{t("creator.network")}</CHeading>
          </Box>
          <Flex alignItems={"center"} justifyContent={"center"}>
            <Grid
              templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
              maxW={["100%", "60%", "40%"]}
            >
              {topCreators.map((creator) => (
                <Box
                  key={creator._id}
                  w={"100%"}
                  h={"fit-content"}
                  p={"2rem"}
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Avatar
                    src={`/api/account/${creator._id}/picture`}
                    size={"2xl"}
                    bgColor={"transparent"}
                    name={creator._id}
                    objectFit={"cover"}
                    objectPosition={"center"}
                    borderRadius={"lg"}
                    maxW={["400px", "500px", "1000px"]}
                    shadow={"xl"}
                  />
                  <Text fontWeight={"bold"} fontSize={"xl"} color={"brand.500"}>
                    @{creator._id}
                  </Text>
                  <Text fontWeight={"bold"} fontSize={"xl"} color={"brand.500"}>
                    {creator.count} {t("courses")}
                  </Text>
                </Box>
              ))}
            </Grid>
          </Flex>
        </Box>
      </Box>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["creator"])),
  };
}
