/**
 * apps/web/src/pages/blog/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.12.2022
 *
 */

import * as React from "react";
import { ReactNode, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Flex,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Tr,
  Text,
  Thead,
  UnorderedList,
  Td,
  Th,
  Code,
  Divider,
} from "@chakra-ui/react";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import { useRouter } from "next/router";
import REST from "@codeup/rest";
import Markdown from "markdown-to-jsx";
import { CHeading } from "@codeup/components/dist/global/CHeading";

export default function BlogViewer() {
  const [status, setStatus] = React.useState<"loading" | "error" | "success">(
    "loading"
  );
  const [blog, setBlog] = React.useState<{
    _id: string;
    title: string;
    content: string;
    tags: string[];
    published_at: string;
    authorUsername: string;
  } | null>(null);

  const markdownToListOfElements = (markdown: string) => {
    const elements: ReactNode[] = [];

    // recognize all headings
    const headings = markdown.match(/(#+)(.*)/g);
    if (headings) {
      headings.forEach((heading) => {
        const level = heading.match(/#+/g)?.[0].length;
        const content = heading.replace(/#+/g, "").trim();
        elements.push(
          <Heading
            mb={4}
            mt={4}
            fontSize={
              level === 1
                ? "2xl"
                : level === 2
                ? "xl"
                : level === 3
                ? "lg"
                : level === 4
                ? "md"
                : level === 5
                ? "sm"
                : "xs"
            }
          >
            {content}
          </Heading>
        );
      });
    }

    // recognize bold, italic and strikethrough
    const bold = markdown.match(/(\*\*|__)(.*?)\1/g);
    if (bold) {
      bold.forEach((bold) => {
        const content = bold.replace(/(\*\*|__)/g, "").trim();
        elements.push(<b>{content}</b>);
      });
    }

    const italic = markdown.match(/(\*|_)(.*?)\1/g);
    if (italic) {
      italic.forEach((italic) => {
        const content = italic.replace(/(\*|_)/g, "").trim();
        elements.push(<i>{content}</i>);
      });
    }

    return elements;
  };

  const router = useRouter();

  useEffect(() => {
    const id = router.query.id;

    if (id) {
      REST.Blog.getBlog(id as string).then((res) => {
        if (res.status === 200) {
          setBlog(res.payload.blog);
          setStatus("success");
        } else {
          setStatus("error");
        }
      });
    }
  }, [router]);

  return (
    <>
      {status === "loading" ? (
        <>
          <Flex
            w={"100%"}
            h={"100vh"}
            justifyContent={"center"}
            alignItems={"center"}
            direction={"column"}
            bg={"#000"}
          >
            <CircularProgress size={"80px"} isIndeterminate color="red.300" />
            <Heading size={"lg"} mt={4}>
              Laden...
            </Heading>
          </Flex>
        </>
      ) : (
        <>
          {status === "error" ? (
            <>
              <ErrorComponent description={"Ein Fehler ist aufgetreten!"} />
            </>
          ) : (
            <>
              <Box
                w={"100%"}
                minH={"100vh"}
                h={"fit-content"}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                bg={"#000"}
              >
                <Box
                  w={"100%"}
                  mt={8}
                  mb={8}
                  maxW={["100%", "70%"]}
                  h={"fit-content"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  p={4}
                  bg={"black"}
                  borderRadius={"md"}
                  boxShadow={"2xl"}
                >
                  <Box mb={6} textAlign={"center"}>
                    <CHeading size={"2xl"}>{blog?.title}</CHeading>
                  </Box>
                  <Divider />
                  <Markdown
                    options={{
                      overrides: {
                        h1: {
                          component: Heading,
                          props: {
                            fontSize: "6xl",
                            mb: 4,
                            mt: 4,
                            color: "brand.500",
                            fontFamily: "Jetbrains Mono ExtraBold",
                            letterSpacing: -2,
                          },
                        },
                        h2: {
                          component: Heading,
                          props: {
                            fontSize: "4xl",
                            mb: 4,
                            mt: 4,
                            color: "brand.500",
                            fontFamily: "Jetbrains Mono ExtraBold",
                          },
                        },
                        h3: {
                          component: Heading,
                          props: {
                            fontSize: "2xl",
                            mb: 4,
                            mt: 4,
                          },
                        },
                        h4: {
                          component: Heading,
                          props: {
                            fontSize: "xl",
                            mb: 4,
                            mt: 4,
                          },
                        },
                        h5: {
                          component: Heading,
                          props: {
                            fontSize: "lg",
                            mb: 4,
                            mt: 4,
                          },
                        },
                        h6: {
                          component: Heading,
                          props: {
                            fontSize: "md",
                            mb: 4,
                            mt: 4,
                          },
                        },
                        a: {
                          component: Link,
                          props: {
                            fontSize: "xl",
                            color: "brand.500",
                          },
                        },
                        ul: {
                          component: UnorderedList,
                          props: {
                            fontSize: "xl",
                          },
                        },
                        ol: {
                          component: OrderedList,
                          props: {
                            fontSize: "xl",
                          },
                        },
                        li: {
                          component: ListItem,
                          props: {
                            fontSize: "xl",
                          },
                        },
                        table: {
                          component: Table,
                          props: {
                            fontSize: "xl",
                          },
                        },
                        thead: {
                          component: Thead,
                          props: {
                            fontSize: "xl",
                          },
                        },
                        tbody: {
                          component: Tbody,
                          props: {
                            fontSize: "xl",
                          },
                        },
                        tr: {
                          component: Tr,
                          props: {
                            fontSize: "xl",
                          },
                        },
                        th: {
                          component: Th,
                          props: {
                            fontSize: "xl",
                          },
                        },
                        td: {
                          component: Td,
                          props: {
                            fontSize: "xl",
                          },
                        },
                        p: {
                          component: Text,
                          props: {
                            fontSize: "xl",
                          },
                        },
                        code: {
                          component: Code,
                          props: {
                            fontSize: "xl",
                          },
                        },
                      },
                    }}
                  >
                    {blog?.content as string}
                  </Markdown>
                </Box>
              </Box>
            </>
          )}
        </>
      )}
    </>
  );
}
