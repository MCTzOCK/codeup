/**
 * src/components/explore/CourseCard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.06.2022
 *
 */

import * as React from "react";
import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { Course } from "@codeup/util";

export default function CourseCard(props: { course: Course }) {
  return (
    <>
      <Box shadow={"xl"} rounded={"xl"} bg={"gray.900"}>
        <Flex direction={["column", "row"]}>
          <Image
            src={props.course.splashImage}
            alt={props.course.displayName}
            w={"full"}
            h={64}
            flex={"45%"}
          />
          <Box flex={"65%"} p={"2rem"}>
            <Flex direction={"row"}>
              <Flex direction={"column"} flex={"100%"}>
                <Heading>{props.course.displayName}</Heading>
                <Text color={"gray.500"}>{props.course.description}</Text>
                <Flex mt={"1.2rem"}>
                  <Button colorScheme={props.course.colorScheme}>
                    Start Course
                  </Button>
                </Flex>
              </Flex>
              <Box flex={[0, "100%"]}></Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
