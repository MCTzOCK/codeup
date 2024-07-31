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
  Box,
} from "@chakra-ui/react";
import REST from "@codeup/rest";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import {
  FaClock,
  FaEdit,
  FaFile,
  FaPlus,
  FaTags,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import CodeUpModal from "@codeup/components/dist/codeup/CodeUpModal";
import Editor from "@monaco-editor/react";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { sProp } from "../../global/i18nstaticProps";

export default function Blog() {
  const [blogs, setBlogs] = React.useState<
    {
      _id: string;
      title: string;
      content: string;
      tags: string[];
      published_at: string;
      authorUsername: string;
    }[]
  >([]);

  const [filteredBlogs, setFilteredBlogs] = React.useState<typeof blogs>([]);

  const toast = useToast();
  const [error, setError] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    REST.Admin.getBlogs({
      token: localStorage.getItem("token") as string,
    }).then((res) => {
      if (res.status === 200) {
        setBlogs(res.payload.blogs);
        setFilteredBlogs(
          res.payload.blogs.filter(
            (b: any) => b.title.includes(query) || b.content.includes(query)
          )
        );
      } else {
        setError(true);
      }
    });
  };

  React.useEffect(() => {
    let q = query;
    q = q.trim();
    setFilteredBlogs(
      blogs.filter(
        (b: any) =>
          b.title.toLowerCase().includes(q.toLowerCase()) ||
          b.content.toLowerCase().includes(q.toLowerCase()) ||
          b.tags.join(" ").toLowerCase().includes(q.toLowerCase())
      )
    );
  }, [query]);

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
                          colorScheme={"brand"}
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
                    colorScheme={"red"}
                    onClick={() => {
                      REST.Admin.deleteBlog({
                        token: localStorage.getItem("token") as string,
                        id: currentBlog?._id as string,
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
                    variant={"brand"}
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

            <GridLayoutV2
              pageTitle={"Blog"}
              search={{
                show: true,
                fields: true,
              }}
              topButtons={[
                {
                  text: "Neu",
                  leftIcon: <FaPlus />,
                  variant: "brand",
                  onClick: async () => {
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
                  },
                },
              ]}
              entries={blogs.map((blog) => {
                return {
                  title: blog.title,
                  buttonRows: [
                    [
                      {
                        text: "Bearbeiten",
                        variant: "brand",
                        leftIcon: <FaEdit />,
                        onClick: () => {
                          setCurrentBlog(blog);
                          onOpen();
                        },
                      },
                    ],
                  ],
                  fields: [
                    {
                      text: "Autor: @" + blog.authorUsername,
                      icon: <FaUser />,
                    },
                    {
                      text: new Date(blog.published_at).toLocaleString(),
                      icon: <FaClock />,
                    },
                    {
                      text: blog.tags.join(", "),
                      icon: <FaTags />,
                    },
                    {
                      text: blog.content.substring(0, 50),
                      icon: <FaFile />,
                    },
                  ],
                };
              })}
            />
          </>
        )}
      </AdminLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, [])),
  };
}
