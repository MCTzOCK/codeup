/**
 * apps/web/src/pages/admin/contents/texts/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.10.2022
 *
 */

import * as React from "react";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import AdminContentsLayout from "@codeup/components/admin/AdminContentsLayout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest";
import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import DataTable from "@codeup/components/extra/DataTable";

export default function Videos() {
  const router = useRouter();

  const [texts, setTexts] = React.useState<
    {
      name: string;
      friendlyName: string;
      content: string;
      _id: string;
      __v: number;
      createdAt: string;
      course: string;
      quiz: {
        question: string;
        answers: {
          answer: string;
          correct: boolean;
        }[];
      }[];
    }[]
  >([]);

  const [courses, setCourses] = React.useState<
    {
      name: string;
      id: string;
    }[]
  >();

  const refresh = () => {
    REST.Admin.listCourses(localStorage.getItem("token") as string, true).then(
      (res) => {
        setCourses(res.payload.courses);

        REST.Admin.listTexts(localStorage.getItem("token") as string).then(
          (res1) => {
            setTexts(res1.payload.texts);
          }
        );
      }
    );
  };

  useEffect(refresh, []);

  const textToRow = (video: any) => {
    return [
      () => {
        router.push(`/admin/contents/texts/${video._id}`);
      },
      <>
        <Text>{video.name}</Text>
      </>,
      <>
        <Text>{courses?.find((c) => c.id === video.course)?.name}</Text>
      </>,
      <>
        <Text>{video.quiz.length} Fragen</Text>
      </>,
      new Date(video.createdAt).toLocaleString(),
    ];
  };

  return (
    <>
      <AdminLayout>
        <AdminContentsLayout>
          <Heading size={"xl"} mt={"2rem"} textAlign={"center"}>
            Texte
          </Heading>
          <Flex
            w={"100%"}
            h={"100%"}
            direction={"column"}
            gap={"6rem"}
            alignItems={"center"}
            mt={4}
            p={"2rem"}
          >
            <Box w={"100%"}>
              <DataTable
                reload={refresh}
                columns={["Name", "Kurs", "Quiz", "Erstellt am"]}
                data={texts.map(textToRow)}
                filterOptions={[
                  "Alle",
                  ...(courses
                    ? (courses.map((c) => {
                        return c.name;
                      }) as string[])
                    : []),
                ]}
                sortOptions={[
                  "Erstellt am (aufsteigend)",
                  "Erstellt am (absteigend)",
                ]}
                filter={(q: string, f: string, s: string) => {
                  let x: any = texts.filter((v) => {
                    return (
                      v.name.toLowerCase().includes(q.toLowerCase()) ||
                      v.friendlyName.toLowerCase().includes(q.toLowerCase()) ||
                      v.content.toLowerCase().includes(q.toLowerCase()) ||
                      v.course.toLowerCase().includes(q.toLowerCase())
                    );
                  });

                  switch (s.toLowerCase()) {
                    case "erstellt am (aufsteigend)":
                      x = x.sort((a: any, b: any) => {
                        return (
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                        );
                      });
                      break;
                    case "erstellt am (absteigend)":
                      x = x.sort((a: any, b: any) => {
                        return (
                          new Date(a.createdAt).getTime() -
                          new Date(b.createdAt).getTime()
                        );
                      });
                      break;
                    default:
                      break;
                  }

                  return x.map(textToRow);
                }}
              />
            </Box>
          </Flex>
        </AdminContentsLayout>
      </AdminLayout>
    </>
  );
}
