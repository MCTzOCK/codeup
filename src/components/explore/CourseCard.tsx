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
import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { Course } from "../../util/courses/Course";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export default function CourseCard(props: { course: Course }) {
  const { t } = useTranslation();
  const router = useRouter();

  const [started, setStarted] = useState({
    started: false,
    loading: true,
  });

  useEffect(() => {
    fetch("/api/course/started", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        course: props.course.name,
      }),
    }).then((res) => {
      if (res.status === 200) {
        setStarted({
          started: true,
          loading: false,
        });
      } else {
        setStarted({
          started: false,
          loading: false,
        });
      }
    });
  }, []);

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
                  <Badge
                    colorScheme={
                      props.course.level === "Beginner"
                        ? "green"
                        : props.course.level === "Intermediate"
                        ? "orange"
                        : props.course.level === "Advanced"
                        ? "red"
                        : "gray"
                    }
                  >
                    {t("explore:level-" + props.course.level)}
                  </Badge>
                </Flex>
                <Flex mt={"1.2rem"}>
                  <Button
                    colorScheme={props.course.colorScheme}
                    disabled={started.loading}
                    isLoading={started.loading}
                    onClick={() => {
                      if (!started.loading && !started.started) {
                        fetch("/api/course/start", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            token: localStorage.getItem("token"),
                            course: props.course.name,
                          }),
                        }).then((res) => {
                          router.push("/course/" + props.course.name);
                        });
                      } else {
                        router.push("/course/" + props.course.name);
                      }
                    }}
                  >
                    {started.started
                      ? t("explore:continue-course")
                      : t("explore:start-course")}
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
