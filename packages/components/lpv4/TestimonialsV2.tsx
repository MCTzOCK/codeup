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
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import REST from "@codeup/rest/dist";

export default function TestimonialsV2() {
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
      setTests(res.payload as any[]);
    }
  };

  React.useEffect(() => {
    reloadTests();
  }, []);

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
          Unsere Kunden
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
          Das sagen unsere Mitglieder.
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
              {tests.map((t) => (
                <VStack
                  key={t._id}
                  p={4}
                  rounded={"3xl"}
                  bg={"gray.700"}
                  w={"100%"}
                  h={"fit-content"}
                >
                  <Image
                    src={t.image}
                    alt={t.name}
                    rounded={"3xl"}
                    objectFit={"cover"}
                    h={"15vh"}
                  />
                  <Text color={"gray.200"} fontSize={"sm"} textAlign={"center"}>
                    {t.content}
                  </Text>
                  <Text
                    color={"brand.500"}
                    fontSize={"md"}
                    fontWeight={"bold"}
                    textAlign={"center"}
                  >
                    {t.name}
                  </Text>
                  <Text color={"gray.200"} fontSize={"sm"} textAlign={"center"}>
                    {t.position} bei {t.company}
                  </Text>
                </VStack>
              ))}
            </Grid>
          </Flex>
        )}
      </Flex>
    </>
  );
}
