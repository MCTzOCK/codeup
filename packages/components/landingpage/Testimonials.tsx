/**
 * packages/components/landingpage/Testimonials.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.03.2023
 * Original: https://templateskart.com
 */

import {
  Avatar,
  Box,
  chakra,
  Container,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import SuperText from "./SuperText";
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

const Testimonials = () => {
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
    <Container maxW="5xl" py={10} px={6}>
      <Flex justify="center" mb={8}>
        <SuperText>Was sagen unsere Benutzer?</SuperText>
      </Flex>
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
                  bg={"gray.900"}
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
                  <Text fontWeight="medium" fontSize="sm">
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
                    borderColor="brand"
                    name="avatar"
                    src={obj.image}
                  />
                  <Box textAlign="center">
                    <Text fontWeight="bold" fontSize="lg">
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
  );
};

export default Testimonials;
