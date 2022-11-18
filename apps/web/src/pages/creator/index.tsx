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
import CreatorStudioLayout from "@codeup/components/creator/studio/CreatorStudioLayout";
import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

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
              window.open(
                "mailto:hello@ben-siebert.de?subject=CodeUp%20Partner%20Bewerbung&body=Steckbrief%3A%0D%0A%0D%0AName%3A%20%3Cdein_name%3E%0D%0AAlter%3A%20%3Cdein_alter%3E%0D%0ABiography%3A%20%3Cetwas_%C3%BCber_dich%3E%0D%0AFachgebiet%3A%20%3Cfachgebiet_1%3E%3B%20%3Cfachgebiet_2%3E%3B%20%3Cfachgebiet_...%3E%3B%20%3Cfachgebiet_n%3E%0D%0A(Optional)%20Zus%C3%A4tzliche%20Nachricht%3A%20%3Czus%C3%A4tzliche_nachricht%3E%0D%0A%0D%0AWarum%20will%20ich%20CodeUp%20Creator%20werden%3F%0D%0A%0D%0A%3Cwarum_du_codeup_creator_werden_willst%3E%0D%0A%0D%0AIch%20habe%20%3Cviel%7Cmittelm%C3%A4%C3%9Fig%20viel%7Ceher%20weniger%7Cwenig%7Cfast%20keine%3E%20Zeit%20neue%20CodeUp%20Kurse%20zu%20erstellen.%0D%0A%0D%0AIch%20verf%C3%BCge%20%C3%BCber%20ein%20Mirkofon%3A%20%3Cja%7Cnein%3E%0D%0AIch%20wei%C3%9F%2C%20wie%20man%20eine%20Bildschirmaufnahme%20macht%3A%20%3Cja%7Cnein%3E%0D%0AIch%20habe%20bereits%20Erfahrung%20mit%20der%20Erstellung%20von%20Lerninhalten%3A%20%3Cja%7Cnein%3E%0D%0A%0D%0AVerweise%20(wenn%20vorhanden)%3A%0D%0A%0D%0AYouTube%3A%20%3Cdein_youtube%3E%0D%0AUdemy%3A%20%3Cdein_udemy%3E%0D%0ATwitter%3A%20%3Cdein_twitter%3E%0D%0AInstagram%3A%20%3Cdein_instagram%3E%0D%0A...%0D%0A%0D%0A%0D%0A"
              );
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
    </>
  );
}
