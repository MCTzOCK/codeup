/**
 * apps/web/src/pages/user-cert/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.11.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import {
  CircularProgress,
  Flex,
  Heading,
  Spinner,
  Avatar,
  Image,
  Stack,
  Text,
  Center,
  StackDivider,
  Divider,
  HStack,
  chakra,
  IconButton,
} from "@chakra-ui/react";
import { Card, CardBody, CardFooter, CardHeader } from "@chakra-ui/card";
import { useEffect } from "react";
import REST from "@codeup/rest";
import ErrorComponent from "@codeup/components/global/ErrorComponent";
import { FaCloudDownloadAlt, FaDownload, FaImage } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Canvg, RenderingContext2D } from "canvg";

export default function CertViewer() {
  const router = useRouter();

  const { id } = router.query;

  const [notFound, setNotFound] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const [_rawResponse, _setRawResponse] = React.useState<any>(null);

  useEffect(() => {
    if (id) {
      REST.Certificates.getObtainedCertificate(id as string).then((res) => {
        if (res.status === 200) {
          setLoading(false);
          _setRawResponse(res.payload);
        } else {
          setNotFound(true);
          setLoading(false);
        }
      });
    }
  }, [id]);

  return (
    <>
      {loading ? (
        <>
          <Flex
            w={"100%"}
            h={"100vh"}
            justifyContent={"center"}
            alignItems={"center"}
            direction={"column"}
          >
            <CircularProgress
              size={"100px"}
              isIndeterminate
              color="purple.300"
            />
          </Flex>
        </>
      ) : (
        <>
          {notFound ? (
            <>
              <ErrorComponent
                description={"Das Zertifikat konnte nicht gefunden werden!"}
              />
            </>
          ) : (
            <>
              <Flex
                w={"100%"}
                minH={"100vh"}
                h={"fit-content"}
                justifyContent={"center"}
                alignItems={"center"}
                direction={"column"}
              >
                <Card
                  w={"100%"}
                  maxW={"800px"}
                  bgColor={"black"}
                  boxShadow={"2xl"}
                  mt={"4rem"}
                  mb={"4rem"}
                  p={"2rem"}
                  id={"certificate"}
                >
                  <CardBody>
                    <Image
                      src={_rawResponse?.course?.splashImage}
                      borderRadius={"lg"}
                      alt={_rawResponse?.course?.name}
                    />
                    <Stack mt={6} spacing={3}>
                      <Heading size={"2xl"} textAlign={"center"}>
                        {_rawResponse?.course?.name}
                      </Heading>
                      <Divider />
                      <HStack pt={"2rem"} pb={"2rem"}>
                        <Flex
                          w={"100%"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          direction={"column"}
                        >
                          <Avatar
                            size={"xl"}
                            src={
                              "/api/account/" +
                              _rawResponse?.obtainedCertificate?.username +
                              "/picture"
                            }
                            background={"transparent"}
                          />
                          <Heading
                            mt={2}
                            fontSize={["xl", "2xl"]}
                            textAlign={"center"}
                            fontWeight={"bold"}
                            fontFamily={"Seymour One"}
                          >
                            {_rawResponse?.obtainedCertificate?.name} <br />
                            <Text
                              fontSize={["md", "xl"]}
                              textAlign={"center"}
                              fontWeight={"normal"}
                              fontFamily={"Seymour One"}
                            >
                              @{_rawResponse?.obtainedCertificate?.username}
                            </Text>
                          </Heading>
                        </Flex>
                        <Flex
                          w={"100%"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          direction={"column"}
                        >
                          <CircularProgress
                            size={"100px"}
                            color={"green.400"}
                            value={
                              _rawResponse?.obtainedCertificate?.percentage
                            }
                          >
                            <Text
                              fontSize={["xl", "2xl"]}
                              fontWeight={"bold"}
                              fontFamily={"Seymour One"}
                              textAlign={"center"}
                            >
                              {_rawResponse?.obtainedCertificate?.percentage}%
                            </Text>
                          </CircularProgress>
                        </Flex>
                      </HStack>
                      <Divider />
                      <Stack pt={"2rem"}>
                        <Heading size={"lg"}>Zertifikat</Heading>
                        <Text fontSize={"3xl"} color={"gray.400"}>
                          <chakra.span color={"green.300"}>
                            {_rawResponse?.obtainedCertificate?.name}
                          </chakra.span>
                          &nbsp;(@
                          {_rawResponse?.obtainedCertificate?.username}) hat den
                          Kurs &quot;
                          <chakra.span color={"green.300"}>
                            {_rawResponse?.course?.name}
                          </chakra.span>
                          &quot; am&nbsp;
                          {new Date(
                            _rawResponse?.obtainedCertificate?.date
                          ).toLocaleString()}
                          &nbsp;mit&nbsp;
                          <chakra.span color={"green.300"}>
                            {_rawResponse?.obtainedCertificate?.percentage}
                          </chakra.span>
                          % erfolgreich bestanden.
                        </Text>
                        <Divider />
                        <Text fontSize={"xl"} color={"gray.400"}>
                          Dieses Zertifikat wurde von&nbsp;@
                          <chakra.span color={"green.300"}>
                            {_rawResponse?.course?.creator}
                          </chakra.span>
                          &nbsp;im Namen von&nbsp;
                          <chakra.span color={"green.300"}>CodeUp</chakra.span>
                          &nbsp;ausgestellt.
                        </Text>
                      </Stack>
                    </Stack>
                    <Flex
                      mt={16}
                      gap={"1.2rem"}
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      w={"100%"}
                    >
                      <img src={"/codeup.svg"} width={64} height={64} />
                      <Heading size={"lg"}>CodeUp</Heading>
                    </Flex>
                    <IconButton
                      aria-label={"Download"}
                      icon={<FaCloudDownloadAlt />}
                      onClick={() => {
                        window.open(
                          "/api/cert?id=" + id + "&export=true",
                          "_blank"
                        );
                      }}
                      position={"absolute"}
                      top={"1rem"}
                      right={"1rem"}
                      display={
                        navigator.userAgent.includes("puppeteer")
                          ? "none"
                          : "flex"
                      }
                    />
                  </CardBody>
                </Card>
              </Flex>
            </>
          )}
        </>
      )}
    </>
  );
}
