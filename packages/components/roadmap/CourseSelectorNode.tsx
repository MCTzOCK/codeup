/**
 * packages/components/roadmap/CourseSelectorNode.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.04.2023
 *
 */

import * as React from "react";
import { useCallback } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import {
  Box,
  Divider,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Image,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import SuperText from "../landingpage/SuperText";
import PopupManager from "@codeup/web/src/global/PopupManager";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/router";
import { Handle, Position } from "reactflow";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import AuthenticateLoadingIndicator from "../admin/AuthenticateLoadingIndicator";

export default function CourseSelectorNode({
  data,
  isConnectable,
}: {
  data: string[];
  isConnectable: boolean;
}) {
  const onChange = useCallback((evt: any) => {}, []);

  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [courses, setCourses] = React.useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = React.useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      let courses: any = [];
      let availableCourses: any = [];
      for (const course of data) {
        const res = await REST.Course.getCourse({
          token: AccountManager.getActiveToken(),
          course: course,
        });

        if (res.status === 200) {
          courses.push(res.payload.course);
        }
      }

      setCourses(courses);

      const res = await REST.Course.listCourses({
        token: AccountManager.getActiveToken(),
      });

      if (res.status === 200) {
        availableCourses = res.payload.courses;
      }

      setAvailableCourses(availableCourses);
      setLoaded(true);
    })();
  }, []);

  const router = useRouter();

  return (
    <>
      <Box p={6} w={"100%"}>
        <Handle type={"target"} position={Position.Left} />
        <SuperText>Kurse</SuperText>
        {loaded ? (
          <>
            <FormControl mb={2} mt={6} w={"100%"}>
              <AutoComplete
                suggestWhenEmpty
                openOnFocus
                emptyState={"Keine Kurse gefunden"}
                onChange={async (v: string) => {
                  if (v === "") return;

                  (
                    document.querySelector(
                      "#course_ac_input"
                    ) as HTMLInputElement
                  ).value = "";

                  const course = availableCourses.find((c) => c.name === v);

                  if (!course) return;

                  const res = await REST.Roadmap.updateRoad({
                    token: AccountManager.getActiveToken(),
                    id: router.query.id as string,
                    update: {
                      linkedCourses: [...courses, course].map((c) => c._id),
                    },
                  });

                  if (res.status !== 200) {
                    PopupManager.alert({
                      title: "Fehler",
                      description:
                        "Es ist ein Fehler aufgetreten: " + res.payload.error,
                    });
                    return;
                  }

                  setCourses([...courses, course]);
                }}
              >
                <AutoCompleteInput
                  variant={"filled"}
                  placeholder={"Kurs hinzufügen"}
                  id={"course_ac_input"}
                  w={"100%"}
                />
                <AutoCompleteList backgroundColor={"gray.800"} w={"100%"} p={4}>
                  {availableCourses
                    .filter((a) => {
                      return !courses.find((c) => c._id === a._id);
                    })
                    .map((a) => {
                      return (
                        <>
                          <AutoCompleteItem
                            value={a.name}
                            key={"course_" + a._id}
                            align={"center"}
                          >
                            <Image w={20} src={a.splashImage} mr={4} />
                            <Stack>
                              <Heading size={"md"}>{a.name}</Heading>
                              <Text>von @{a.creator}</Text>
                            </Stack>
                          </AutoCompleteItem>
                        </>
                      );
                    })}
                </AutoCompleteList>
              </AutoComplete>
            </FormControl>
            <Stack>
              <StackDivider />
              <Divider />
              {courses.map((c) => {
                return (
                  <>
                    <Flex
                      w={"100%"}
                      alignItems={"center"}
                      gap={5}
                      p={2}
                      _hover={{
                        cursor: "pointer",
                        backgroundColor: "gray.700",
                      }}
                      onClick={(e) => {
                        if (e.target === e.currentTarget) {
                          router.push("/course/" + c._id);
                        }
                      }}
                    >
                      <Image w={20} src={c.splashImage} mr={4} flex={"20%"} />
                      <Stack flex={"70%"}>
                        <Heading size={"md"}>{c.name}</Heading>
                        <Text>von @{c.creator}</Text>
                      </Stack>
                      <IconButton
                        flex={"10%"}
                        aria-label={"Kurs entfernen"}
                        icon={<FaTrash />}
                        colorScheme={"red"}
                        variant={"ghost"}
                        onClick={async () => {
                          const res = await REST.Roadmap.updateRoad({
                            token: AccountManager.getActiveToken(),
                            id: router.query.id as string,
                            update: {
                              linkedCourses: courses
                                .filter((c2) => c2._id !== c._id)
                                .map((c) => c._id),
                            },
                          });

                          if (res.status !== 200) {
                            PopupManager.alert({
                              title: "Fehler",
                              description:
                                "Es ist ein Fehler aufgetreten: " +
                                res.payload.error,
                            });
                            return;
                          }

                          setCourses(courses.filter((c2) => c2._id !== c._id));
                        }}
                      />
                    </Flex>
                    <StackDivider />
                    <Divider />
                  </>
                );
              })}
            </Stack>
          </>
        ) : (
          <AuthenticateLoadingIndicator text={"Lade Kurse..."} inline={true} />
        )}
        <Handle type={"source"} position={Position.Right} />
      </Box>
    </>
  );
}
