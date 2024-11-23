/**
 * packages/components/v2/UserPageCertificates.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.11.2024
 *
 */

import * as React from "react";
import REST from "@codeup/rest/dist";
import {
  Box,
  Flex,
  Heading,
  Image,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function UserPageCertificates(props: { username: string }) {
  const [result, setResult] = React.useState<
    {
      course: {
        name: string;
        description: string;
        splashImage: string;
        friendlyName: string;
      };
      obtained: {
        _id: string;
        username: string;
        date: string;
        percentage: number;
      };
    }[]
  >([]);

  React.useEffect(() => {
    if (!props.username) return;

    reload();
  }, [props.username]);

  const reload = async () => {
    const res = await REST.UserPages.getCertificates(props.username);
    if (res.status === 200) {
      setResult(res.payload.data);
    } else {
      console.error(res);
    }
  };

  return (
    <>
      <Stack gap={4}>
        {result.map((r, i) => (
          <Box
            key={i}
            bg={"gray.900"}
            p={4}
            rounded={"lg"}
            cursor={"pointer"}
            as={"a"}
            href={"/user-cert/" + r.obtained._id}
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              align={"center"}
              gap={4}
            >
              <Image src={r.course.splashImage} w={200} h={100} />
              <Box minW={"200px"}>
                <Text color={"gray.300"} fontSize={"xs"}>
                  {new Date(r.obtained.date).toLocaleString()}
                </Text>
                <Heading size={"md"}>{r.course.name}</Heading>
                <Text color={"gray.300"}>{r.course.description}</Text>
                <Progress
                  value={r.obtained.percentage}
                  mt={2}
                  variant={"brand"}
                  rounded={"md"}
                  w={"100%"}
                />
              </Box>
            </Flex>
          </Box>
        ))}
      </Stack>
    </>
  );
}
