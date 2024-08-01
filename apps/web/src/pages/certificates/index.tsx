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
import Head from "next/head";
import AccountManager from "@codeup/util/dist/AccountManager";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import { translateOnlineV3 } from "../../global/i18n/onlineTranslateV3";

export default function Index() {
  const [certificates, setCertificates] = React.useState<string[]>([]);
  const [courses, setCourses] = React.useState<any[]>([]);

  const { t } = useTranslation("certificates");

  const toast = useToast();

  const { userInfo, loggedIn, loaded } = useLoggedIn();
  useEffect(() => {
    if (loaded && !loggedIn) {
      router.push("/");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    }
  }, [userInfo, loggedIn, loaded]);

  React.useEffect(() => {
    REST.Course.listCourses({
      token: AccountManager.getActiveToken(),
    }).then(async (res) => {
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
            if (router.locale === "de") {
              courses.push(course);
              certs.push(r1.payload);
            } else {
              courses.push({
                ...course,
                name: await translateOnlineV3({
                  to: router.locale as string,
                  from: "de",
                  text: course.name,
                }),
                description: await translateOnlineV3({
                  to: router.locale as string,
                  from: "de",
                  text: course.description,
                }),
              });
            }
          }
        }

        // @ts-ignore
        setCertificates(certs);
        setCourses(courses);
      } else {
        toast({
          title: t("base:control.error"),
          description: t("base:control.error.request") + res.payload.error,
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
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      <Flex
        direction="column"
        w={"100%"}
        gap={"2rem"}
        pt={"2rem"}
        h={"fit-content"}
        minH={"100vh"}
        alignItems={"center"}
        bg={"#000"}
      >
        <Flex
          w={"100%"}
          h={"fit-content"}
          direction={"column"}
          alignItems={"center"}
          p={4}
        >
          <Box textAlign={"center"}>
            <CHeading size={"3xl"}>{t("title")}</CHeading>
          </Box>
          <Text fontSize={["xl", "2xl"]}>{t("text")}</Text>
        </Flex>
        <Grid
          templateColumns={"repeat(auto-fit, minmax(300px, 1fr));"}
          gap={2}
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
                      w={"100%"}
                      h={"150px"}
                    />
                    <CHeading size={"xl"}>{c.name}</CHeading>
                    <Text fontSize={"xl"} color={"gray.300"} textAlign={"left"}>
                      {t("by")}&nbsp;
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
              {t("no.courses")}
            </Heading>
          </>
        ) : null}
      </Flex>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["certificates"])),
  };
}
