/**
 * apps/web/src/pages/admin/contents/courses/index.tsx
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
import { useEffect } from "react";
import { useRouter } from "next/router";
import REST from "@codeup/rest";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
} from "@chakra-ui/react";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";

export default function Index() {
  const [courses, setCourses] = React.useState<
    {
      id: string;
      name: string;
      friendlyName: string;
      description: string;
      splashImage: string;
      available: boolean;
    }[]
  >([]);

  const router = useRouter();

  useEffect(() => {
    REST.Admin.listCourses(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setCourses(res.payload.courses);
        }
      }
    );
  }, []);

  return (
    <>
      <AdminLayout>
        <AdminContentsLayout>
          <Box w={"max"} mt={"2rem"} ml={"1rem"}>
            <Button
              leftIcon={<FaPlus />}
              colorScheme="green"
              onClick={() => router.push("/admin/contents/courses/new")}
            >
              Neu
            </Button>
          </Box>

          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {courses.map((course) => (
              <>
                <GridItem m={4}>
                  <Box
                    bg={"gray.900"}
                    color={"white"}
                    rounded={"lg"}
                    p={6}
                    h={"100%"}
                  >
                    <Flex
                      justifyContent={"space-between"}
                      direction={"column"}
                      gap={2}
                    >
                      <Image
                        src={course.splashImage}
                        alt={course.name}
                        shadow={"xl"}
                        w={"100%"}
                        h={"150px"}
                      />
                      <Heading
                        size={"lg"}
                        color={"white"}
                        fontWeight={"bold"}
                        textAlign={"left"}
                        mt={4}
                      >
                        {course.name}
                      </Heading>
                      <Heading
                        size={"sm"}
                        color={"gray.400"}
                        fontWeight={"normal"}
                        textAlign={"left"}
                      >
                        /course/{course.friendlyName}
                      </Heading>
                      <Heading
                        size={"md"}
                        color={"gray.400"}
                        fontWeight={"normal"}
                        textAlign={"left"}
                      >
                        {course.description}
                      </Heading>
                      <ButtonGroup mt={6}>
                        <Button
                          colorScheme={"red"}
                          leftIcon={<FaTrash />}
                          w={"100%"}
                        >
                          Löschen
                        </Button>
                        <Button
                          colorScheme={"blue"}
                          leftIcon={<FaPen />}
                          w={"100%"}
                        >
                          Bearbeiten
                        </Button>
                      </ButtonGroup>
                    </Flex>
                  </Box>
                </GridItem>
              </>
            ))}
          </Grid>
        </AdminContentsLayout>
      </AdminLayout>
    </>
  );
}
