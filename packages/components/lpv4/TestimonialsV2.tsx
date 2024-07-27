/**
 * packages/components/lpv4/TestimonialsV2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.07.2024
 *
 */

import * as React from "react";
import {
  Avatar,
  Box,
  chakra,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import REST from "@codeup/rest/dist";
import { useLoggedIn } from "@codeup/hooks";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { translateOnlineV3 } from "@codeup/web/src/global/i18n/onlineTranslateV3";

export default function TestimonialsV2() {
  const { userInfo, loggedIn } = useLoggedIn();
  const router = useRouter();

  const [tests, setTests] = React.useState<
    {
      _id: string;
      company: string;
      content: string;
      image: string;
      name: string;
      position: string;
    }[]
  >([]);

  const reloadTests = async () => {
    const res = await REST.Landingpage.getTestimonials();

    if (res.status === 200) {
      const pl = res.payload as any[];
      if (router.locale === "de") {
        setTests(pl);
      } else {
        let nPl: any = [];
        for await (const p of pl) {
          const translated = await translateOnlineV3({
            from: "de",
            to: router.locale as string,
            text: p.content,
          });

          nPl.push({
            ...p,
            content: translated,
          });
        }

        setTests(nPl);
      }
    }
  };

  const { t } = useTranslation("home");

  React.useEffect(() => {
    if (!router || !router.locale) return;
    reloadTests();
  }, [router, router.locale]);

  return (
    <>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        direction={"column"}
      >
        <Text
          textTransform={"uppercase"}
          fontWeight={"bold"}
          color={"gray.200"}
          fontSize={"lg"}
        >
          {t("testimonials.our.customers")}
        </Text>
        <Heading
          size={"xl"}
          color={"white"}
          fontFamily={"Inter"}
          wordBreak={"break-word"}
          fontWeight={600}
          lineHeight={1.3}
          mt={4}
          p={2}
          textAlign={"center"}
        >
          {t("testimonials.our.customers.title")}
        </Heading>

        {tests.length !== 0 && (
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            w={"100%"}
            paddingInline={{
              base: 2,
              lg: 24,
            }}
          >
            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
              }}
              gap={4}
              mt={8}
              maxW={{
                base: "100%",
                sm: "90%",
                xl: "60%",
              }}
            >
              {tests.map((ta) => (
                <VStack
                  key={ta._id}
                  p={4}
                  rounded={"3xl"}
                  bg={"gray.700"}
                  w={"100%"}
                  h={"fit-content"}
                  minH={"100%"}
                >
                  <Image
                    src={ta.image}
                    alt={ta.name}
                    rounded={"3xl"}
                    objectFit={"cover"}
                    h={"15vh"}
                  />
                  <Text color={"gray.200"} fontSize={"sm"} textAlign={"center"}>
                    {ta.content}
                  </Text>
                  <Text
                    color={"brand.500"}
                    fontSize={"md"}
                    fontWeight={"bold"}
                    textAlign={"center"}
                  >
                    {ta.name}
                  </Text>
                  <Text color={"gray.200"} fontSize={"sm"} textAlign={"center"}>
                    {ta.position} {t("testimonials.working.at")} {ta.company}
                  </Text>
                </VStack>
              ))}
              <VStack
                p={4}
                rounded={"3xl"}
                bg={"gray.700"}
                w={"100%"}
                h={"fit-content"}
                minH={"100%"}
                border={"5px dashed"}
                borderColor={"brand.500"}
              >
                <Image
                  src={`/api/account/${
                    userInfo.username || "undefined"
                  }/picture`}
                  alt={loggedIn ? userInfo.username : "Unbekannt"}
                  rounded={"3xl"}
                  objectFit={"cover"}
                  h={"15vh"}
                />
                <Text color={"gray.200"} fontSize={"sm"} textAlign={"center"}>
                  {t("testimonials.new.text")}
                </Text>
                <Text
                  color={"brand.500"}
                  fontSize={"md"}
                  fontWeight={"bold"}
                  textAlign={"center"}
                >
                  {t("testimonials.new")}
                </Text>
                <Text color={"gray.200"} fontSize={"sm"} textAlign={"center"}>
                  {t("testimonials.new.write.email")}{" "}
                  <chakra.a
                    href={"mailto:ben@codeup.space"}
                    color={"brand.500"}
                  >
                    ben@codeup.space
                  </chakra.a>
                </Text>
              </VStack>
            </Grid>
          </Flex>
        )}
      </Flex>
    </>
  );
}
