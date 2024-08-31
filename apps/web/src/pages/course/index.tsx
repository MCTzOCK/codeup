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
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";
import Head from "next/head";
import AccountManager from "@codeup/util/dist/AccountManager";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import { translateOnlineV3 } from "../../global/i18n/onlineTranslateV3";

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
      interactive: boolean;
    }[]
  >([]);

  const { t } = useTranslation("courses");

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
      interactive: boolean;
    }[]
  >([]);

  const [coursesLoading, setCoursesLoading] = React.useState<boolean>(true);

  const toast = useToast();
  const router = useRouter();

  React.useEffect(() => {
    REST.Course.listCourses({
      token: AccountManager.getActiveToken(),
    }).then(async (res) => {
      if (res.status === 200) {
        if (router.locale === "de") {
          setCourses(res.payload.courses);
          setFilteredCourses(res.payload.courses);
        } else {
          let cs: any[] = [];

          for await (const x of res.payload.courses) {
            cs.push({
              ...x,
              name: await translateOnlineV3({
                to: router.locale as string,
                from: "de",
                text: x.name,
              }),
              description: await translateOnlineV3({
                to: router.locale as string,
                from: "de",
                text: x.description,
              }),
            });
          }

          setCourses(cs);
          setFilteredCourses(cs);
        }
        setCoursesLoading(false);
      } else {
        toast({
          title: t("base:control.error"),
          description: t("base:control.error.request") + " " + res.status,
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
        <title>{t("doc.title")}</title>
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
            <CHeading size={"3xl"}>{t("courses")}</CHeading>
          </Box>
          <Text fontSize={["xl", "2xl"]} textAlign={["center", "initial"]}>
            {t("current.stats")
              .replace("{0}", courses.length.toString())
              .replace(
                "{1}",
                courses
                  .map((course) => course.contentPositions.length)
                  .reduce((a, b) => a + b, 0)
                  .toString()
              )}
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
              placeholder={t("search.courses")}
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
          templateColumns={"repeat(auto-fit, minmax(300px, 1fr));"}
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
                  bg={"gray.800"}
                  color={"white"}
                  rounded={"md"}
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
                    <Badge
                      colorScheme={c.interactive ? "green" : "brand"}
                      p={2}
                      w={"fit-content"}
                      fontSize={"md"}
                      rounded={"full"}
                    >
                      {c.interactive ? t("interactive") : t("video")}
                    </Badge>
                    <CHeading size={"xl"}>{c.name}</CHeading>
                    <Text fontSize={"xl"} color={"gray.300"} textAlign={"left"}>
                      {t("course.by")}&nbsp;
                      <chakra.span color={"brand.500"}>
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
                      {c.contentPositions.length} {t("sections")}
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
              {t("no.courses")}
            </Heading>
          </>
        ) : null}
        {coursesLoading && (
          <>
            <AuthenticateLoadingIndicator text={t("courses.loading")} />
          </>
        )}
      </Flex>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["courses"])),
  };
}
