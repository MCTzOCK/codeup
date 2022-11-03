/**
 * apps/web/src/pages/admin/contents/videos/index.tsx
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

  const [videos, setVideos] = React.useState<
    {
      name: string;
      friendlyName: string;
      transcript: string;
      youtube: string;
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

        REST.Admin.listVideos(localStorage.getItem("token") as string).then(
          (res1) => {
            setVideos(res1.payload.videos);
          }
        );
      }
    );
  };

  useEffect(refresh, []);

  const [currentVideo, setCurrentVideo] = React.useState<{
    name: string;
    friendlyName: string;
    transcript: string;
    youtube: string;
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
  } | null>(null);

  const videoToRow = (video: any) => {
    return [
      () => {
        router.push(`/admin/contents/videos/${video.youtube.split("=")[1]}`);
      },
      <Image
        src={`https://i.ytimg.com/vi/${video.youtube.split("=")[1]}/hq720.jpg`}
        width={120}
        height={90}
      />,
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
            Videos
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
                columns={["Thumbnail", "Name", "Kurs", "Quiz", "Erstellt am"]}
                data={videos.map(videoToRow)}
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
                  let x: any = videos.filter((v) => {
                    return (
                      v.name.toLowerCase().includes(q.toLowerCase()) ||
                      v.friendlyName.toLowerCase().includes(q.toLowerCase()) ||
                      v.transcript.toLowerCase().includes(q.toLowerCase()) ||
                      v.youtube.toLowerCase().includes(q.toLowerCase()) ||
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

                  return x.map(videoToRow);
                }}
              />
            </Box>
          </Flex>
        </AdminContentsLayout>
      </AdminLayout>
    </>
  );
}
