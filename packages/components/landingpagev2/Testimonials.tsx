/**
 * packages/components/landingpagev2/Testimonials.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.05.2024
 *
 */

import * as React from "react";
import {
  Avatar,
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import REST from "@codeup/rest/dist";

interface TestimonialAttributes {
  name: string;
  position: string;
  company: string;
  content: string;
  image: string;
}

const testimonials0: TestimonialAttributes[] = [
  {
    name: "Markus Lüersmann",
    position: "Head of Engineering",
    company: "Hengst Filtration",
    image: "/_static/customers/markus.jpeg",
    content: `Ben hat eine einzigartige Plattform und Lernprogramm erschaffen, dass jedem den Einstieg in die Programmierwelt auf einfache Weise ermöglicht. Die Jury beeindruckte besonders, wie er seine bemerkenswerte Kenntnisse mit Leidenschaft anderen interessierten Programmierern weitergeben möchte.`,
  },
  {
    name: "Ben Siebert",
    position: "Entwickler",
    company: "CodeUp",
    image: "https://avatars.githubusercontent.com/u/53553315",
    content: `CodeUp ist eine tolle Plattform, um neue Technologien zu lernen.
    Ich freue mich sehr, dass CodeUp mitlerweile schon so viele Nutzer hat und hoffe, dass es vielen
    Menschen hilft, programmieren zu lernen.`,
  },
  {
    name: "Felix Schlesinger",
    position: "Entwickler",
    image: "/_static/customers/felix.jpg",
    company: "Ratzfatz Foto",
    content: `
    Man kennt viele IDEs, welche für den Informatikunterricht eingesetzt werden.
    CodeUp ist eine Möglichkeit für Schüler einen besseren Einstieg in die Programierung zu finden und für Lehrkräfte, um ihren Unterricht von Grund auf neu und interessanter zu gestalten.
    Wir setzen CodeUp im Unterrricht ein und sind einfach nur begeistert.`,
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = React.useState<
    TestimonialAttributes[]
  >([]);

  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    REST.Landingpage.getTestimonials().then((res) => {
      if (res.status === 200) {
        setTestimonials(res.payload as any);
        setLoading(false);
      } else {
        setTestimonials(testimonials0);
        setLoading(false);
      }
    });
  }, []);
  return (
    <>
      <Box p={6} mt={6} mb={6} roundedTop={"xl"}>
        <Heading
          color={"brand.500"}
          textAlign={"center"}
          fontFamily={"Jetbrains Mono ExtraBold"}
          letterSpacing={-2}
          fontSize={["2xl", "4xl", "5xl"]}
        >
          Was Unsere Kunden Sagen
        </Heading>

        <Container maxW="8xl" py={10} px={6}>
          {loading ? (
            <Text>Meinungen werden geladen...</Text>
          ) : (
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              placeItems="center"
              spacing={1}
              mt={12}
              mb={4}
            >
              {testimonials.map((obj, index) => (
                <>
                  <Stack
                    key={index}
                    direction={{ base: "column", sm: "row" }}
                    spacing={2}
                    mb={5}
                    justify="center"
                  >
                    <Stack
                      maxW="330px"
                      minW={"300px"}
                      boxShadow="lg"
                      rounded="md"
                      p={6}
                      pos="relative"
                      bg={"black"}
                      _after={{
                        content: `""`,
                        w: "0",
                        h: "0",
                        borderColor: `transparent ${"#141517"} transparent`,
                        borderStyle: "solid",
                        borderWidth: "10px 0 10px 10px",
                        position: "absolute",
                        top: { base: "unset", sm: "45%" },
                        right: { base: "unset", sm: "-10px" },
                        left: { base: "48%", sm: "unset" },
                        bottom: { base: "-15px", sm: "unset" },
                        transform: { base: "rotate(90deg)", sm: "unset" },
                        display: "block",
                      }}
                    >
                      <Text fontWeight="medium" fontSize="md">
                        {obj.content}
                      </Text>
                    </Stack>
                    <Stack
                      direction="column"
                      spacing={2}
                      p={2}
                      justify="flex-end"
                      alignItems="center"
                    >
                      <Avatar
                        size="xl"
                        showBorder={true}
                        borderColor="brand.500"
                        name="avatar"
                        src={obj.image}
                      />
                      <Box textAlign="center">
                        <Text
                          fontWeight="bold"
                          fontSize="lg"
                          color={"brand.500"}
                        >
                          {obj.name}
                        </Text>
                        <Text fontWeight="medium" fontSize="xs" color="white">
                          {obj.position}, {obj.company}
                        </Text>
                      </Box>
                    </Stack>
                  </Stack>
                </>
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>
    </>
  );
}
