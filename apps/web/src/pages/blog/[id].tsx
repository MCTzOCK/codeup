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
} from "@chakra-ui/react";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import { useRouter } from "next/router";
import REST from "@codeup/rest";
import Markdown from "markdown-to-jsx";

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
                  bg={"#000000"}
                  borderRadius={"md"}
                  boxShadow={"2xl"}
                >
                  <Heading size={"lg"} textAlign={"center"} mb={6}>
                    {blog?.title}
                  </Heading>
                  <Markdown
                    options={{
                      overrides: {
                        h1: {
                          component: Heading,
                          props: {
                            fontSize: "4xl",
                          },
                        },
                        h2: {
                          component: Heading,
                          props: {
                            fontSize: "2xl",
                          },
                        },
                        h3: {
                          component: Heading,
                          props: {
                            fontSize: "xl",
                          },
                        },
                        h4: {
                          component: Heading,
                          props: {
                            fontSize: "lg",
                          },
                        },
                        h5: {
                          component: Heading,
                          props: {
                            fontSize: "md",
                          },
                        },
                        h6: {
                          component: Heading,
                          props: {
                            fontSize: "sm",
                          },
                        },
                        a: {
                          component: Link,
                          props: {
                            fontSize: "md",
                            color: "blue.300",
                          },
                        },
                        ul: {
                          component: UnorderedList,
                          props: {
                            fontSize: "md",
                          },
                        },
                        ol: {
                          component: OrderedList,
                          props: {
                            fontSize: "md",
                          },
                        },
                        li: {
                          component: ListItem,
                        },
                        table: {
                          component: Table,
                        },
                        thead: {
                          component: Thead,
                        },
                        tbody: {
                          component: Tbody,
                        },
                        tr: {
                          component: Tr,
                        },
                        th: {
                          component: Th,
                        },
                        td: {
                          component: Td,
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
