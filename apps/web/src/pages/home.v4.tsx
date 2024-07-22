/**
 * apps/web/src/pages/home.v4.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.07.2024
 *
 */

import * as React from "react";
import styles from "../styles/Home.module.scss";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { CHeading } from "@codeup/components/global/CHeading";
import { useLoggedIn } from "@codeup/hooks";
import router from "next/router";

export default function HomeV4() {
  const { loggedIn, loaded } = useLoggedIn();

  return (
    <>
      <Box position={"absolute"} w={"100%"} h={"100vh"} zIndex={-1} top={0}>
        <Box
          className={styles.grid}
          w={["100%", "100%", "80%"]}
          minH={["90vh", "90vh", "70vh"]}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"flex-start"}
        />
      </Box>
      <Flex w={"100%"} direction={["column", "column", "row", "row"]} gap={12}>
        <Box
          zIndex={1}
          maxW={{
            base: "100%",
            md: "60%",
            lg: "55%",
            xl: "60%",
            "2xl": "40%",
          }}
          padding={[4, 4, 28]}
          paddingTop={[10, 10, 24]}
        >
          <CHeading
            size={{
              base: "3xl",
              md: "3xl",
              lg: "3xl",
              xl: "4xl",
            }}
            color={"white"}
            fontFamily={"Inter"}
            wordBreak={"break-word"}
            fontWeight={600}
            lineHeight={1.3}
          >
            Lerne coden in Wochen, nicht Jahren.
          </CHeading>
          <Text color={"gray.200"} fontSize={"3xl"}>
            Gratis. Einfach. Schnell.
          </Text>
          <Button
            variant={"brand"}
            mt={{
              base: 8,
              md: 8,
              lg: 12,
              xl: 12,
              "2xl": 12,
            }}
            size={"lg"}
            onClick={() => {
              if (loggedIn) {
                router.push("/dashboard/v2");
              } else {
                window.dispatchEvent(new CustomEvent("codeup::open_login"));
              }
            }}
          >
            {loggedIn ? "Dashboard" : "Jetzt loslegen!"}
          </Button>
          <Text color={"gray.200"} fontSize={"sm"} mt={3}>
            Keine Kreditkarte erforderlich. Einfach gratis starten!
          </Text>
        </Box>
        <Box
          w={"100%"}
          zIndex={-1}
          pt={16}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          marginLeft={{
            base: 0,
            lg: "-5%",
          }}
          paddingRight={{
            base: 0,
            lg: "7%",
          }}
          padding={{
            sm: "8%",
          }}
        >
          <Image
            maxW={{
              base: "100%",
              md: "80%",
              lg: "120%",
              xl: "80%",
              "2xl": "80%",
            }}
            src={"/_static/images/lpv4/courses.png"}
            className={styles.img0}
          />
        </Box>
      </Flex>
      <Flex
        paddingInline={[2, 24]}
        className={styles.programming_sc}
        gap={6}
        justifyContent={"center"}
      >
        {[
          "typescript",
          "javascript",
          "css",
          "git",
          "go",
          "html",
          "java",
          "mysql",
          "nodejs",
          "python",
          "react",
        ].map((item) => (
          <Image
            src={`/_static/vectors/languages/${item}.svg`}
            width={28}
            className={styles.programming_icon}
          />
        ))}
      </Flex>
    </>
  );
}
