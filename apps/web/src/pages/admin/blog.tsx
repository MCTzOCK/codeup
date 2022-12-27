/**
 * apps/web/src/pages/admin/blog.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.12.2022
 *
 */

import * as React from "react";
import AdminLayout from "@codeup/components/dist/admin/AdminLayout";
import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  useDisclosure,
  useToast,
  chakra,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  HStack,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import REST from "@codeup/rest";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import { FaPlus, FaTrash } from "react-icons/fa";
import CodeUpModal from "@codeup/components/dist/codeup/CodeUpModal";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import Editor from "@monaco-editor/react";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function Blog() {
  const [blogs, setBlogs] = React.useState<
    {
      _id: string;
      title: string;
      content: string;
      tags: string[];
      published_at: string;
      authorUsername: string;
      comments: {
        author: string;
        authorUsername: string;
        content: string;
        published_at: string;
      }[];
    }[]
  >([]);

  const toast = useToast();
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    REST.Admin.getBlogs({
      token: localStorage.getItem("token") as string,
    }).then((res) => {
      if (res.status === 200) {
        setBlogs(res.payload.blogs);
      } else {
        setError(true);
      }
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentBlog, setCurrentBlog] = React.useState<{
    _id: string;
    title: string;
    content: string;
    tags: string[];
    published_at: string;
    authorUsername: string;
  } | null>(null);

  return (
    <>
      <AdminLayout>
        {error ? (
          <ErrorComponent description={"Es ist ein Fehler aufgetreten!"} />
        ) : (
          <>
            <CodeUpModal
              onOpen={onOpen}
              onClose={onClose}
              isOpen={isOpen}
              title={currentBlog?.title || "Neuer Blog"}
              noCloseButton
            >
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Titel</FormLabel>
                  <Input
                    type={"text"}
                    placeholder={"Titel des Blogs"}
                    value={currentBlog?.title}
                    onChange={(e) => {
                      if (currentBlog) {
                        setCurrentBlog({
                          ...currentBlog,
                          title: e.target.value as string,
                        });
                      }
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tags</FormLabel>
                  <HStack mb={4} mt={4} overflow={"scroll"} w={"fit-content"}>
                    {currentBlog?.tags.map((tag) => {
                      return (
                        <Tag
                          size={"md"}
                          key={tag}
                          borderRadius={"full"}
                          variant={"solid"}
                          colorScheme={"green"}
                        >
                          <TagLabel>{tag.toUpperCase()}</TagLabel>
                          <TagCloseButton
                            onClick={() => {
                              setCurrentBlog({
                                ...currentBlog,
                                tags: currentBlog.tags.filter((t) => t !== tag),
                              });
                            }}
                          />
                        </Tag>
                      );
                    })}
                  </HStack>
                  <InputGroup>
                    <Input
                      type={"text"}
                      placeholder={"Tag hinzufügen"}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (currentBlog) {
                            if (
                              !currentBlog.tags.includes(
                                e.currentTarget.value as string
                              )
                            ) {
                              setCurrentBlog({
                                ...currentBlog,
                                tags: [
                                  ...currentBlog.tags,
                                  e.currentTarget.value,
                                ],
                              });

                              e.currentTarget.value = "";
                            }
                          }
                        }
                      }}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl data-color-mode={"dark"}>
                  <FormLabel>Inhalt</FormLabel>
                  <Editor
                    height={"50vh"}
                    language={"markdown"}
                    theme={"vs-dark"}
                    value={currentBlog?.content}
                    onChange={(value) => {
                      if (currentBlog) {
                        setCurrentBlog({
                          ...currentBlog,
                          content: value as string,
                        });
                      }
                    }}
                  />
                </FormControl>
                <ButtonGroup
                  display={"flex"}
                  justifyContent={"flex-end"}
                  w={"100%"}
                >
                  <Button
                    leftIcon={<FaTrash />}
                    onClick={() => {
                      REST.Admin.deleteBlog({
                        token: localStorage.getItem("token") as string,
                        id: currentBlog?._id,
                      }).then((res) => {
                        if (res.status === 200) {
                          toast({
                            title: "Blog gelöscht",
                            description: "Der Blog wurde erfolgreich gelöscht",
                            status: "success",
                            duration: 1500,
                            isClosable: false,
                            position: "bottom-right",
                          });
                          reload();
                          onClose();
                        } else {
                          toast({
                            title: "Fehler",
                            description: res.payload.error,
                            status: "error",
                            duration: 1500,
                            isClosable: false,
                            position: "bottom-right",
                          });
                        }
                      });
                    }}
                  >
                    Löschen
                  </Button>
                  <Button
                    colorScheme={"red"}
                    onClick={() => {
                      onClose();
                    }}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    colorScheme={"green"}
                    onClick={() => {
                      REST.Admin.updateBlog({
                        token: localStorage.getItem("token") as string,
                        id: currentBlog?._id as string,
                        update: {
                          title: currentBlog?.title as string,
                          content: currentBlog?.content as string,
                          tags: currentBlog?.tags as string[],
                        },
                      }).then((res) => {
                        if (res.status === 200) {
                          reload();
                          onClose();
                          setCurrentBlog(null);
                        } else {
                          toast({
                            title: "Fehler",
                            description: res.payload.error,
                            status: "error",
                            duration: 1500,
                            isClosable: false,
                            position: "bottom-right",
                          });
                        }
                      });
                    }}
                  >
                    Speichern
                  </Button>
                </ButtonGroup>
              </Stack>
            </CodeUpModal>

            <Heading size={"2xl"} textAlign={"center"} mt={"2rem"} mb={"2rem"}>
              Blog
            </Heading>
            <Grid
              templateColumns={[
                "repeat(1, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
              ]}
              gap={"2rem"}
              p={8}
            >
              <GridItem
                key={"new"}
                bg={"gray.900"}
                p={"1rem"}
                borderRadius={"0.5rem"}
                _hover={{
                  cursor: "pointer",
                  borderColor: "blue.300",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
                onClick={() => {
                  REST.Admin.createBlog({
                    token: localStorage.getItem("token") as string,
                    title: "Neuer Blog",
                    content: "Inhalt",
                    tags: [],
                  }).then((res) => {
                    reload();
                    setCurrentBlog(res.payload.blog);
                    onOpen();
                  });
                }}
              >
                <Heading
                  fontSize={"8xl"}
                  textAlign={"center"}
                  color={"blue.300"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  display={"flex"}
                >
                  <FaPlus />
                </Heading>
              </GridItem>
              {blogs.map((blog) => (
                <>
                  <GridItem
                    key={blog._id}
                    bg={"gray.900"}
                    p={"1rem"}
                    borderRadius={"0.5rem"}
                    onClick={() => {
                      setCurrentBlog(blog);
                      onOpen();
                    }}
                    cursor={"pointer"}
                    _hover={{
                      shadow: "xl",
                    }}
                  >
                    <Flex alignItems={"center"}>
                      <Heading size={"lg"}>{blog.title}</Heading>
                      <Text ml={4}>
                        von
                        <chakra.span color={"blue.300"} ml={2}>
                          @{blog.authorUsername}
                        </chakra.span>
                      </Text>
                      <Text ml={"auto"}>
                        {new Date(blog.published_at).toLocaleString()}
                      </Text>
                    </Flex>
                    <HStack mt={4} mb={4} overflow={"scroll"} w={"fit-content"}>
                      {blog.tags.map((tag) => {
                        return (
                          <>
                            <Tag size={"md"} key={tag} borderRadius={"full"}>
                              <TagLabel>{tag.toUpperCase()}</TagLabel>
                            </Tag>
                          </>
                        );
                      })}
                    </HStack>
                    <p>{blog.content.substring(0, 200)}</p>
                  </GridItem>
                </>
              ))}
            </Grid>
          </>
        )}
      </AdminLayout>
    </>
  );
}
