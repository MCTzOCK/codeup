/**
 * src/components/course/CourseTitle.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.06.2022
 *
 */

import * as React from "react";
import { useTranslation } from "next-i18next";
import { Heading, Text } from "@chakra-ui/react";

export default function CourseTitle(props: {
  course: string;
  section: number;
  sectionTitle: string;
}) {
  return (
    <>
      <Text textAlign={"center"} color={"gray.400"}>
        {props.course}
      </Text>
      <Heading textAlign={"center"}>
        Section&nbsp;{props.section}:&nbsp;
        {props.sectionTitle}
      </Heading>
    </>
  );
}
