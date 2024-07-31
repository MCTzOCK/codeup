/**
 * packages/components/ide/TemplatePicker.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.2022
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import REST from "@codeup/rest";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaPlus, FaStar } from "react-icons/fa";
import { useLoggedIn } from "@codeup/hooks";
import TemplateImporter from "./TemplateImporter";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export default function TemplatePicker() {
  const { t: tx } = useTranslation("ide");
  const [templates, setTemplates] = useState<
    {
      _id: string;
      owner: string;
      authorDisplayName: string;
      displayName: string;
      project: string;
      description: string;
      uses: number;
      ratings: {
        user: string;
        rating: number;
        _id: string;
      }[];
      __v: number;
    }[]
  >([]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    REST.IDE.getAllTemplates().then((res) => {
      setTemplates(res.payload.templates);
      setLoaded(true);
    });
  }, []);

  const [term, setTerm] = useState("");

  const [importing, setImporting] = useState(false);
  const [importTemplate, setImportTemplate] = useState("0");

  const { loggedIn, userInfo } = useLoggedIn();

  const router = useRouter();

  return (
    <>
      {importing ? (
        <TemplateImporter templateId={importTemplate} />
      ) : (
        <>
          {!loaded ? (
            <>
              <Flex
                w={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
                mt={"1.2rem"}
              >
                <Spinner size={"xl"} />
              </Flex>
            </>
          ) : null}

          {loaded && templates.length === 0 ? (
            <>
              <Text textAlign={"center"} mt={"1.2rem"}>
                {tx("no.templates.published")}
              </Text>
            </>
          ) : null}
          {templates.length !== 0 ? (
            <>
              <Input
                type={"text"}
                onChange={(e) => {
                  setTerm(e.target.value.toLowerCase().trim());
                }}
                placeholder={tx("search")}
                mt={"1.2rem"}
              />
              <SimpleGrid
                minChildWidth={200}
                w={"100%"}
                mt={"2rem"}
                gap={"1.2rem"}
              >
                {templates.map((t) => {
                  if (
                    t.displayName.toLowerCase().includes(term) ||
                    t.description.toLowerCase().includes(term)
                  ) {
                    let rating = 0;

                    for (const ra of t.ratings) {
                      rating += ra.rating;
                    }

                    rating = rating / t.ratings.length;

                    if (isNaN(rating)) {
                      rating = 0;
                    }

                    async function vote(voting: number) {
                      await REST.IDE.rateTemplate({
                        token: localStorage.getItem("token") as string,
                        rating: voting,
                        templateId: t._id,
                      });

                      REST.IDE.getAllTemplates().then((res) => {
                        setTemplates(res.payload.templates);
                      });
                    }

                    return (
                      <>
                        <Box
                          rounded={"xl"}
                          shadow={"xl"}
                          w={"100%"}
                          padding={"1.2rem"}
                          bgColor={"gray.800"}
                        >
                          <Stack>
                            <Heading size={"lg"} textAlign={"center"}>
                              {t.displayName}
                            </Heading>
                            <Flex
                              alignItems={"center"}
                              justifyContent={"center"}
                            >
                              {rating}
                              &nbsp;&nbsp;/&nbsp;&nbsp;5&nbsp;
                              <FaStar color={"orange"} />
                            </Flex>
                            <Flex
                              alignItems={"center"}
                              justifyContent={"center"}
                            >
                              von&nbsp;
                              <Link
                                color={"blue.300"}
                                onClick={() => {
                                  router.push("/forum/" + t.authorDisplayName);
                                }}
                              >
                                {t.authorDisplayName}
                              </Link>
                            </Flex>
                            <Flex
                              alignItems={"center"}
                              justifyContent={"center"}
                            >
                              {t.uses} {tx("template.used")}
                            </Flex>
                            <Text>{t.description}</Text>
                            <Button
                              colorScheme={"blue"}
                              leftIcon={<FaPlus />}
                              onClick={async () => {
                                setImportTemplate(t._id);
                                setImporting(true);
                              }}
                            >
                              {tx("use")}
                            </Button>
                            <Popover>
                              <PopoverTrigger>
                                <Button
                                  disabled={
                                    t.ratings.find(
                                      (r) => r.user === userInfo.id
                                    ) !== undefined
                                  }
                                  leftIcon={<FaStar />}
                                >
                                  {tx("rate")}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent bgColor={"black"}>
                                <PopoverArrow bgColor={"black"} />
                                <PopoverHeader>
                                  {tx("rate.template")}
                                </PopoverHeader>
                                <PopoverBody>
                                  <Button
                                    m=".4rem"
                                    colorScheme="red"
                                    leftIcon={<FaStar />}
                                    onClick={() => {
                                      vote(1);
                                    }}
                                  >
                                    1
                                  </Button>
                                  <Button
                                    m=".4rem"
                                    colorScheme="orange"
                                    leftIcon={<FaStar />}
                                    onClick={() => {
                                      vote(2);
                                    }}
                                  >
                                    2
                                  </Button>
                                  <Button
                                    m=".4rem"
                                    colorScheme="yellow"
                                    leftIcon={<FaStar />}
                                    onClick={() => {
                                      vote(3);
                                    }}
                                  >
                                    3
                                  </Button>
                                  <Button
                                    m=".4rem"
                                    colorScheme={"blue"}
                                    leftIcon={<FaStar />}
                                    onClick={() => {
                                      vote(4);
                                    }}
                                  >
                                    4
                                  </Button>
                                  <Button
                                    m=".4rem"
                                    colorScheme={"green"}
                                    leftIcon={<FaStar />}
                                    onClick={() => {
                                      vote(5);
                                    }}
                                  >
                                    5
                                  </Button>
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </Stack>
                        </Box>
                      </>
                    );
                  } else {
                    return null;
                  }
                })}
              </SimpleGrid>
            </>
          ) : null}
        </>
      )}
    </>
  );
}
