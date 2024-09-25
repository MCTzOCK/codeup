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
  Box,
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
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import { translateOnlineV3 } from "../../global/i18n/onlineTranslateV3";
import Head from "next/head";

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
  const { t } = useTranslation("blog");

  React.useEffect(() => {
    REST.Blog.getBlogsB().then(async (res) => {
      if (res.status === 200) {
        let b = res.payload.blogs;

        if (router.locale === "de") {
          setBlogs(res.payload.blogs);
          setFilteredBlogs(res.payload.blogs);
        } else {
          const rb: any[] = [];

          for await (const x of b) {
            const nTitle = await translateOnlineV3({
              text: x.title,
              to: router.locale as string,
              from: "de",
            });
            const nContent = await translateOnlineV3({
              text: x.content,
              to: router.locale as string,
              from: "de",
            });

            rb.push({
              ...x,
              title: nTitle,
              content: nContent,
            });
          }

          setBlogs(rb);
          setFilteredBlogs(rb);
        }
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
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      {error ? (
        <>
          <ErrorComponent description={t("error.loading")} />
        </>
      ) : (
        <Box bg={"#000"} h={"fit-content"} minH={"100vh"}>
          <Box p={6} textAlign={"center"}>
            <CHeading size={"2xl"}>{t("title")}</CHeading>
          </Box>
          <Flex w={"100%"} alignItems={"center"} justifyContent={"center"}>
            <Input
              w={["75%", "25%"]}
              placeholder={t("base:control.search")}
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
                  bg={"black"}
                  p={"1rem"}
                  borderRadius={"0.5rem"}
                  as={Link}
                  href={"/blog/" + blog._id}
                  cursor={"pointer"}
                  _hover={{
                    textDecoration: "none",
                  }}
                  onClick={() => {
                    router.push("/blog/" + blog._id);
                  }}
                >
                  <Flex alignItems={"center"}>
                    <CHeading size={"lg"}>{blog.title}</CHeading>
                    <Text ml={"auto"}>
                      {new Date(blog.published_at).toLocaleString()}
                    </Text>
                  </Flex>

                  <Text>
                    von
                    <chakra.span color={"brand.500"} ml={2}>
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
                </GridItem>
              </>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["blog"])),
  };
}
