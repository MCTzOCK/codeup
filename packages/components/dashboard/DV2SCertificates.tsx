/**
 * packages/components/dashboard/DV2SCertificates.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.07.2024
 *
 */

import * as React from "react";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { Button, Flex, Grid, Image, Progress, Text } from "@chakra-ui/react";
import { CHeading } from "../global/CHeading";
import router from "next/router";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function DV2SCertificates() {
  const [certificates, setCertificates] = React.useState<
    {
      _id: string;
      course: string;
      username: string;
      name: string;
      date: string;
      percentage: number;
      courseObj: {
        splashImage: string;
        name: string;
      };
    }[]
  >([]);
  const [error, setError] = React.useState<string>("");

  useEffect(() => {
    reloadCertificates();
  }, []);

  const reloadCertificates = async () => {
    const res = await REST.Certificates.getObtainedCertificates(
      AccountManager.getActiveToken()
    );

    if (res.status !== 200) {
      setError(
        "Zertifikate konnten nicht geladen werden: " + res.payload.error
      );
      return;
    }

    setCertificates(res.payload.certs);
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
            Deine Zertifikate
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
            {certificates.map((cert) => {
              return (
                <Flex
                  key={cert._id}
                  bg={"gray.700"}
                  rounded={"md"}
                  p={4}
                  direction={"column"}
                  cursor={"pointer"}
                  onClick={() => {
                    router.push(`/user-cert/${cert._id}`);
                  }}
                >
                  <Flex direction={"row"} mt={2}>
                    <Image
                      src={cert.courseObj.splashImage}
                      alt={cert.courseObj.name}
                      width={["75%", "100%"]}
                      maxW={"150px"}
                      maxHeight={"150px"}
                      objectFit={"cover"}
                      rounded={"md"}
                    />
                    <Flex direction={"column"} ml={4} justifyContent={"center"}>
                      <CHeading size={"md"}>{cert.courseObj.name}</CHeading>
                      <CHeading size={"md"}>
                        {new Date(cert.date).toLocaleString()}
                      </CHeading>
                      <Progress
                        value={cert.percentage}
                        variant={"brand"}
                        mt={2}
                        max={100}
                        rounded={"md"}
                      />
                      <Text>Du hast {cert.percentage}% erhalten!</Text>
                    </Flex>
                  </Flex>
                </Flex>
              );
            })}
          </Grid>
          {certificates.length === 0 && (
            <Flex
              justifyContent={"center"}
              p={4}
              direction={"column"}
              gap={4}
              mt={-4}
            >
              <Text>Du hast noch keine Zertifikate erhalten.</Text>
              <Button
                variant={"brand"}
                leftIcon={<FaExternalLinkAlt />}
                w={"fit-content"}
                onClick={() => {
                  router.push("/certificates");
                }}
              >
                Zertifikate
              </Button>
            </Flex>
          )}
        </>
      )}
    </>
  );
}
