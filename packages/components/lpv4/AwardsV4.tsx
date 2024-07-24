/**
 * packages/components/lpv4/AwardsV4.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.2024
 *
 */

import * as React from "react";
import { Flex, Heading, Text, Image, Box } from "@chakra-ui/react";
import useMeasure from "react-use-measure";
import { animate, useMotionValue, motion } from "framer-motion";
import { useEffect } from "react";

const jufoLogo = "/_static/images/logos/jufo-stern.svg";
const stLogo = "/_static/images/logos/startup_teens_logo.jpeg";
const hengstLogo = "/_static/images/logos/hengst.jpeg";

export default function AwardsV4() {
  const [awards, setAwards] = React.useState<
    {
      date: string;
      issuer: string;
      issuerLogo: string;
      title: string;
    }[]
  >([
    {
      date: "Feb. 2023",
      issuer: "Stiftung Jugend forscht e. V.",
      issuerLogo: jufoLogo,
      title: "Regionalsieg Münsterland",
    },
    {
      date: "Feb. 2023",
      issuer: "Hengst Filtration",
      issuerLogo: hengstLogo,
      title: "Sonderpreis Hengst SE",
    },
    {
      date: "März 2023",
      issuer: "Stiftung Jugend forscht e. V.",
      issuerLogo: jufoLogo,
      title: "Landessieg NRW",
    },
    {
      date: "März 2023",
      issuer: "Stiftung Jugend forscht e. V.",
      issuerLogo: jufoLogo,
      title: "Teilnahme JugendUnternimmt Summerschool",
    },
    {
      date: "Mai 2023",
      issuer: "Stiftung Jugend forscht e. V.",
      issuerLogo: jufoLogo,
      title: "Teilnahme 58. Bundeswettbewerb",
    },
    {
      date: "Juni 2023",
      issuer: "STARTUP TEENS Netzwerk e.V.",
      issuerLogo: stLogo,
      title: "2. Platz Bundesfinale",
    },
  ]);

  const [ref, { width }] = useMeasure();

  const xTranslation = useMotionValue(0);

  useEffect(() => {
    //let finalPosition = -width - 560;
    let finalPosition = -width / 2 - 8;

    let controls = animate(xTranslation, [0, finalPosition], {
      ease: "linear",
      duration: 25,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0,
    });

    return controls.stop;
  }, [xTranslation, width]);

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
          Unsere Auszeichnungen
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
          Unsere Erfolge sprechen für sich.
        </Heading>
      </Flex>
      <Box w={"100%"}>
        <motion.div
          ref={ref}
          style={{
            marginTop: "2rem",
            gap: "1rem",
            width: "fit-content",
            display: "flex",
            flexDirection: "row",
            x: xTranslation,
          }}
        >
          {[...awards, ...awards].map((award) => (
            <Card {...award} key={award.title} />
          ))}
        </motion.div>
      </Box>
    </>
  );
}

const Card = (props: {
  title: string;
  date: string;
  issuer: string;
  issuerLogo: string;
}) => (
  <Flex
    direction={"column"}
    bg={"gray.700"}
    p={4}
    rounded={"xl"}
    w={"fit-content"}
    gap={4}
    minW={"400px"}
    maxW={"400px"}
  >
    <Text color={"gray.200"} fontSize={"lg"} fontWeight={"bold"}>
      {props.date}
    </Text>
    <Flex alignItems={"center"} justifyContent={"space-between"} gap={4}>
      <Image
        src={props.issuerLogo}
        alt={props.issuer}
        w={24}
        rounded={"md"}
        p={2}
        background={"#fff"}
      />
    </Flex>
    <Heading
      size={"md"}
      color={"white"}
      fontFamily={"Inter"}
      wordBreak={"break-word"}
      fontWeight={600}
      lineHeight={1.3}
    >
      {props.title}
    </Heading>
    <Text color={"gray.200"} fontSize={"md"}>
      {props.issuer}
    </Text>
  </Flex>
);
