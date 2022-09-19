/**
 * src/pages/explore/index..tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.06.2022
 *
 */

import * as React from "react";
import { useEffect } from "react";
import redirect from "@codeup/util/src/userworkflow/redirect";
import CourseDB from "@codeup/util/src/courses/CourseDB";
import { Flex } from "@chakra-ui/react";
import CourseCard from "@codeup/components/explore/CourseCard";

export default function Index() {
  useEffect(() => {
    redirect({
      forceAnonymous: false,
      redirectToLogin: true,
      redirectTo: "/courses",
      allowAnonymous: false,
    });
  }, []);

  return (
    <>
      <Flex direction={"column"} gap={"2rem"} p={"4rem"}>
        {CourseDB.courses.map((course) => {
          return <CourseCard course={course} key={"card-" + course} />;
        })}
      </Flex>
    </>
  );
}
