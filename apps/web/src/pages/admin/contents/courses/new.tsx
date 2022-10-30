/**
 * apps/web/src/pages/admin/contents/courses/new.tsx
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
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Textarea,
} from "@chakra-ui/react";
import { FaBookOpen, FaGlobe } from "react-icons/fa";
import REST from "@codeup/rest";
import { Promise } from "mongoose";
import { useRouter } from "next/router";

export default function New() {
  const router = useRouter();

  return (
    <>
      <AdminLayout>
        <AdminContentsLayout>
          <Box w={"full"} mt={"2rem"} p={"2rem"}>
            <Heading size={"lg"} mb={"2rem"}>
              Neuer Kurs
            </Heading>
            <Box w={["100%", "50%"]}>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const data = new FormData(e.target as HTMLFormElement);

                  const name = data.get("name") as string;
                  const friendlyName = data.get("friendlyName") as string;
                  const description = data.get("description") as string;
                  const splashImage = data.get("splashImage") as File;

                  const FR = new FileReader();

                  FR.readAsDataURL(splashImage);

                  FR.onload = async () => {
                    const res = await REST.Admin.createCourse({
                      token: localStorage.getItem("token") as string,
                      name,
                      friendlyName,
                      description,
                      splashImage: FR.result as string,
                    });

                    router.push("/admin/contents/courses");
                  };
                }}
              >
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>
                      <FaBookOpen />
                    </InputLeftAddon>
                    <Input
                      type={"text"}
                      name={"name"}
                      placeholder={"Name"}
                      required
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mt={"2rem"} isRequired>
                  <FormLabel>URL Freundlicher Name</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>
                      <FaGlobe />
                    </InputLeftAddon>
                    <Input
                      type={"text"}
                      name={"friendlyName"}
                      placeholder={"URL Freundlicher Name"}
                      required
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mt={"2rem"} isRequired>
                  <FormLabel>Beschreibung</FormLabel>
                  <Textarea
                    name={"description"}
                    placeholder={"Beschreibung"}
                    required
                  />
                </FormControl>
                <FormControl mt={"2rem"} isRequired>
                  <FormLabel>Vorschaubild</FormLabel>
                  <Input required type={"file"} name={"splashImage"} />
                </FormControl>
                <Button
                  type={"submit"}
                  colorScheme={"green"}
                  mt={"2rem"}
                  w={"100%"}
                >
                  Erstellen
                </Button>
              </form>
            </Box>
          </Box>
        </AdminContentsLayout>
      </AdminLayout>
    </>
  );
}
