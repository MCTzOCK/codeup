/**
 * packages/components/dashboard/DV2SCourses.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.07.2024
 *
 */

import * as React from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { Button, Flex, Grid, Image, Progress, Text } from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";
import { CHeading } from "../global/CHeading";
import router from "next/router";

export default function DV2SCourses() {
  const [courses, setCourses] = React.useState<
    {
      coverImage: string;
      name: string;
      progress: number;
      href: string;
    }[]
  >([]);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    reloadCourses();
  }, []);

  const reloadCourses = async () => {
    const res = await REST.Course.getEnrollments({
      token: AccountManager.getActiveToken(),
    });

    if (res.status !== 200) {
      setError("Kurse konnten nicht geladen werden: " + res.payload.error);
      return;
    }

    let progress: { [key: string]: number } = {};

    for await (const x of res.payload.enrollments) {
      const rx = await REST.Course.getCourseProgress({
        token: AccountManager.getActiveToken(),
        course: x.course.name,
      });

      if (rx.status !== 200) {
        setError("Kurse konnten nicht geladen werden: " + rx.payload.error);
        return;
      }

      let percentage = 0;

      const total_sections = x.course.contentPositions.filter(
        (a: string) => a !== "false"
      ).length;

      percentage = (rx.payload.progress.length / total_sections) * 100;

      progress[x.course.name] = percentage;
    }

    const courses = res.payload.enrollments.map((x: any) => {
      return {
        coverImage: x.course.splashImage,
        name: x.course.name,
        progress: progress[x.course.name] || 0,
        href: `/course/${x.course.name}`,
      };
    });

    setCourses(courses);
  };

  return (
    <>
      {error ? (
        <>
          <Flex justifyContent={"center"} p={4}>
            {error}
          </Flex>
        </>
      ) : (
        <>
          <CHeading size={"lg"} mb={4}>
            Deine Kurse
          </CHeading>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
            ]}
            gap={6}
            p={2}
          >
            {courses.map((course) => {
              return (
                <Flex bg={"gray.800"} rounded={"md"} p={4} key={course.name}>
                  <Flex
                    direction={"column"}
                    w={"100%"}
                    h={"100%"}
                    justifyContent={"center"}
                  >
                    <Flex
                      bg={"transparent"}
                      rounded={"md"}
                      p={2}
                      w={"100%"}
                      justifyContent={"center"}
                    >
                      <Image
                        src={course.coverImage}
                        alt={course.name}
                        rounded={"md"}
                        w={"100%"}
                        objectFit={"contain"}
                        maxH={"200px"}
                      />
                    </Flex>
                    <Flex
                      direction={"column"}
                      rounded={"md"}
                      p={2}
                      w={"100%"}
                      mt={2}
                    >
                      <CHeading size={"lg"}>{course.name}</CHeading>
                      <Progress
                        value={course.progress}
                        variant={"brand"}
                        mt={2}
                        max={100}
                        rounded={"md"}
                      />
                      <Text textAlign={"center"}>
                        Du hast diesen Kurs zu {course.progress}% abgeschlossen.
                      </Text>
                      <Flex mt={2}>
                        <Button
                          variant="brand"
                          onClick={() => {
                            router.push(course.href);
                          }}
                          leftIcon={<FaEye />}
                        >
                          Öffnen
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              );
            })}
          </Grid>
        </>
      )}
    </>
  );
}
