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

  useEffect(() => {
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
  }, []);

  return (
    <>
      <AdminLayout>
        <AdminContentsLayout>
          <Heading size={"xl"} mt={"2rem"} textAlign={"center"}>
            Videos
          </Heading>
        </AdminContentsLayout>
      </AdminLayout>
    </>
  );
}
