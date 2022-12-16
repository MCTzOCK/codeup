/**
 * apps/web/src/pages/creator/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.11.2022
 *
 */

import * as React from "react";
import { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import REST from "@codeup/rest";

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

  return (
    <>
      <Flex
        w={"100%"}
        minH={"100vh"}
        h={"fit-content"}
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        bgPosition={"center"}
        bgRepeat={"no-repeat"}
        bgSize={"cover"}
        bgImage={"url(/_static/images/creator/worker.jpg)"}
      >
        <Heading
          mt={"4rem"}
          fontSize={["3xl", "6xl"]}
          color={"white"}
          textAlign={"center"}
          fontWeight={"bold"}
          fontFamily={"Seymour One"}
          maxW={["75%", "50%"]}
          textShadow={"0px 10px 50px #000000"}
        >
          Werde ein Creator auf CodeUp
        </Heading>

        <Text
          mt={"2rem"}
          fontSize={["xl", "2xl"]}
          color={"white"}
          textAlign={"center"}
          fontFamily={"Seymour One"}
          maxW={["75%", "50%"]}
          textShadow={"0px 10px 50px #000000"}
        >
          Du bist ein Experte in einem bestimmten Bereich? Dann bewirb dich
          jetzt als Creator auf CodeUp! Wir suchen immer wieder neue Creator,
          die hochwertige Inhalte für unsere Community erstellen.
        </Text>

        <ButtonGroup mt={"2rem"} spacing={"2rem"}>
          <Button
            colorScheme={"red"}
            size={"lg"}
            fontSize={"xl"}
            fontWeight={"bold"}
            fontFamily={"Seymour One"}
            textTransform={"uppercase"}
            onClick={() => {
              router.push("/codeup/contact?creator=true");
            }}
          >
            Bewerben
          </Button>
          <Button
            colorScheme={"facebook"}
            size={"lg"}
            fontSize={"xl"}
            fontWeight={"bold"}
            fontFamily={"Seymour One"}
            textTransform={"uppercase"}
            onClick={() => {
              router.push("/creator/studio");
            }}
          >
            Studio
          </Button>
        </ButtonGroup>
      </Flex>
      <Box w={"100%"} h={"fit-content"} p={"4rem"}>
        <Heading
          w={"100%"}
          fontSize={["3xl", "6xl"]}
          textAlign={"center"}
          fontWeight={"bold"}
          fontFamily={"Seymour One"}
        >
          Top Creator
        </Heading>
        <Flex
          w={"100%"}
          h={"100%"}
          direction={["column", "row"]}
          alignItems={"center"}
          justifyContent={"center"}
          mt={4}
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
                size={"2xl"}
                name={creator._id}
                bgColor={"transparent"}
                src={`/api/account/${creator._id}/picture`}
              />
              <Heading
                mt={2}
                fontSize={["xl", "2xl"]}
                textAlign={"center"}
                fontWeight={"bold"}
                fontFamily={"Seymour One"}
              >
                @{creator._id} <br />
                <Text
                  fontSize={["md", "xl"]}
                  textAlign={"center"}
                  fontWeight={"normal"}
                  fontFamily={"Seymour One"}
                >
                  {creator.count} Kurs(e)
                </Text>
              </Heading>
            </Box>
          ))}
        </Flex>
      </Box>
    </>
  );
}
