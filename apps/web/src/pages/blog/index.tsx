/**
 * apps/web/src/pages/blog/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.12.2022
 *
 */

import * as React from "react";
import {
  chakra,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Link,
  Tag,
  TagLabel,
  Text,
  useToast,
} from "@chakra-ui/react";
import REST from "@codeup/rest";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Blogs() {
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
    REST.Blog.getBlogsB().then((res) => {
      if (res.status === 200) {
        setBlogs(res.payload.blogs);
        setFilteredBlogs(res.payload.blogs);
      } else {
        setError(true);
      }
    });
  }, []);

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

  const router = useRouter();

  return (
    <>
      {error ? (
        <>
          <ErrorComponent description={"Blogs konnten nicht geladen werden."} />
        </>
      ) : (
        <>
          <Heading
            fontSize={["3xl", "6xl"]}
            color={"white"}
            textAlign={"center"}
            fontWeight={"bold"}
            fontFamily={"Seymour One"}
            textShadow={"0px 10px 100px #000000"}
            m={8}
          >
            Blog
          </Heading>
          <Flex w={"100%"} alignItems={"center"} justifyContent={"center"}>
            <Input
              w={["75%", "25%"]}
              placeholder={"Suche"}
              onChange={(e) => {
                setQuery(e.currentTarget.value);
              }}
            />
          </Flex>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
            gap={"2rem"}
            p={8}
          >
            {filteredBlogs.map((blog) => (
              <>
                <GridItem
                  key={blog._id}
                  bg={"gray.900"}
                  p={"1rem"}
                  borderRadius={"0.5rem"}
                >
                  <Flex alignItems={"center"}>
                    <Heading size={"lg"}>{blog.title}</Heading>
                    <Text ml={"auto"}>
                      {new Date(blog.published_at).toLocaleString()}
                    </Text>
                  </Flex>

                  <Text>
                    von
                    <chakra.span color={"blue.300"} ml={2}>
                      @{blog.authorUsername}
                    </chakra.span>
                  </Text>
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
                  <p>{blog.content.substring(0, 200)}&nbsp;...</p>
                  <Link
                    href={"/blog/" + blog._id}
                    color={"blue.300"}
                    onClick={() => {
                      router.push("/blog/" + blog._id);
                    }}
                  >
                    Weiterlesen
                  </Link>
                </GridItem>
              </>
            ))}
          </Grid>
        </>
      )}
    </>
  );
}
