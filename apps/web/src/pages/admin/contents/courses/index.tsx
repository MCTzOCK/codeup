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
  Textarea,
} from "@chakra-ui/react";
import {
  FaBookReader,
  FaCheckCircle,
  FaPen,
  FaPlus,
  FaRegTimesCircle,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";

export default function Index() {
  const [courses, setCourses] = React.useState<
    {
      _id: string;
      name: string;
      friendlyName: string;
      description: string;
      splashImage: string;
      available: boolean;
    }[]
  >([]);

  const router = useRouter();

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    REST.Admin.listCourses(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setCourses(res.payload.courses);
        }
      }
    );
  };

  const [edit, setEdit] = React.useState<string>("");

  return (
    <>
      <AdminLayout>
        <AdminContentsLayout>
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
                      {edit === course.friendlyName ? (
                        <>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();

                              const data = new FormData(
                                e.target as HTMLFormElement
                              );

                              const name = data.get("name") as string;
                              const friendlyName = data.get(
                                "friendlyName"
                              ) as string;
                              const available = data.get("available") as any;
                              const description = data.get(
                                "description"
                              ) as string;
                              const splashImage = data.get(
                                "splashImage"
                              ) as File;

                              const FR = new FileReader();

                              FR.readAsDataURL(splashImage);

                              FR.onload = async () => {
                                const res = await REST.Admin.updateCourse({
                                  token: localStorage.getItem(
                                    "token"
                                  ) as string,
                                  // @ts-ignore
                                  id: course._id,
                                  update: {
                                    name: name === "" ? course.name : name,
                                    friendlyName:
                                      friendlyName === ""
                                        ? course.friendlyName
                                        : friendlyName,
                                    // @ts-ignore
                                    available: available === "public",
                                    description:
                                      description === ""
                                        ? course.description
                                        : description,
                                    // @ts-ignore
                                    splashImage:
                                      FR.result ===
                                      "data:application/octet-stream;base64,"
                                        ? course.splashImage
                                        : FR.result,
                                  },
                                });

                                refresh();
                                setEdit("");
                              };
                            }}
                          >
                            <Image
                              src={course.splashImage}
                              alt={course.name}
                              shadow={"xl"}
                              w={"100%"}
                              h={"150px"}
                              cursor={"pointer"}
                              _hover={{
                                filter: "brightness(0.5)",
                              }}
                              transition={"filter 0.25s ease"}
                              onClick={() => {
                                document
                                  .getElementById(
                                    `edit_${course.friendlyName}-splashImage`
                                  )
                                  ?.click();
                              }}
                              id={
                                "edit_" +
                                course.friendlyName +
                                "-splashImage_Image"
                              }
                            />
                            <input
                              type={"file"}
                              accept="image/svg+xml"
                              name={"splashImage"}
                              id={
                                "edit_" + course.friendlyName + "-splashImage"
                              }
                              style={{
                                display: "none",
                              }}
                              onChange={(e) => {
                                const file = e.target.files?.item(0);
                                if (file) {
                                  const reader = new FileReader();
                                  reader.readAsDataURL(file);
                                  reader.onload = () => {
                                    if (reader.result) {
                                      document
                                        .getElementById(
                                          "edit_" +
                                            course.friendlyName +
                                            "-splashImage_Image"
                                        )!
                                        .setAttribute(
                                          "src",
                                          reader.result as string
                                        );
                                    }
                                  };
                                }
                              }}
                            />
                            <Input
                              placeholder={"Name"}
                              name={"name"}
                              defaultValue={course.name}
                              mt={"2rem"}
                            />
                            <InputGroup mt={"2rem"}>
                              <InputLeftAddon>/course/</InputLeftAddon>
                              <Input
                                placeholder={"URL Freundlicher Name"}
                                name={"friendlyName"}
                                defaultValue={course.friendlyName}
                              />
                            </InputGroup>
                            <Select
                              name={"available"}
                              mt={"2rem"}
                              defaultValue={
                                course.available ? "public" : "private"
                              }
                            >
                              <option value={"public"}>Öffentlich</option>
                              <option value={"private"}>Privat</option>
                            </Select>
                            <Textarea
                              placeholder={"Beschreibung"}
                              mt={"2rem"}
                              name={"description"}
                              defaultValue={course.description}
                            />
                            <ButtonGroup mt={"2rem"} w={"100%"}>
                              <Button
                                colorScheme={"red"}
                                leftIcon={<FaTimesCircle />}
                                w={"100%"}
                                onClick={() => setEdit("")}
                              >
                                Abbrechen
                              </Button>

                              <Button
                                colorScheme={"green"}
                                leftIcon={<FaCheckCircle />}
                                w={"100%"}
                                type={"submit"}
                              >
                                Speichern
                              </Button>
                            </ButtonGroup>
                          </form>
                        </>
                      ) : (
                        <>
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
                            {course.available ? (
                              <>
                                <Badge colorScheme={"green"} fontSize={"md"}>
                                  Öffentlich
                                </Badge>
                              </>
                            ) : (
                              <>
                                <Badge colorScheme={"red"} fontSize={"md"}>
                                  Privat
                                </Badge>
                              </>
                            )}
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
                              onClick={async () => {
                                await REST.Admin.deleteCourse({
                                  token: localStorage.getItem(
                                    "token"
                                  ) as string,
                                  friendlyName: course.friendlyName,
                                });

                                refresh();
                              }}
                            >
                              Löschen
                            </Button>
                            <Button
                              colorScheme={"blue"}
                              leftIcon={<FaPen />}
                              w={"100%"}
                              onClick={() => setEdit(course.friendlyName)}
                            >
                              Bearbeiten
                            </Button>
                          </ButtonGroup>
                          <ButtonGroup mt={6}>
                            <Button
                              colorScheme={"green"}
                              leftIcon={<FaBookReader />}
                              w={"100%"}
                              onClick={() => {
                                router.push(
                                  // @ts-ignore
                                  "/admin/contents/courses/" + course._id
                                );
                              }}
                            >
                              Inhalte anzeigen
                            </Button>
                          </ButtonGroup>
                        </>
                      )}
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
