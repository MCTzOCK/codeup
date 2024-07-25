/**
 * apps/web/src/pages/codeup/contact.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.22
 *
 */

import * as React from "react";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useLoggedIn } from "@codeup/hooks";
import makeRequest from "@codeup/rest/src/makeRequest";
import DividerWithText from "@codeup/components/dist/global/DividerWithText";
import { useRouter } from "next/router";
import Head from "next/head";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function Contact() {
  const [disableButton, setDisableButton] = React.useState(false);

  const { loggedIn } = useLoggedIn();

  const router = useRouter();

  const toast = useToast();

  const { t } = useTranslation("contact");

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      <Flex
        align="center"
        justify="center"
        w={"100%"}
        h={"fit-content"}
        minH={"100vh"}
        bg={"#000"}
      >
        <Stack
          spacing={8}
          w="100%"
          maxW="800px"
          p={6}
          bgColor={["transparent", "black"]}
          rounded="xl"
          shadow={["none", "xl"]}
        >
          <CHeading size={"2xl"}>{t("title")}</CHeading>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (!loggedIn) {
                window.dispatchEvent(new CustomEvent("codeup::open_login"));
                return;
              }

              const data = new FormData(e.target as HTMLFormElement);

              const category = data.get("category") as string;
              const title = data.get("title") as string;
              const message = data.get("message") as string;

              const r = await makeRequest({
                token: localStorage.getItem("token") as string,
                method: "POST",
                path: "/api/contact",
                body: {
                  message,
                  category,
                  title,
                },
              });

              if (r.status === 200) {
                toast({
                  title: t("message.send"),
                  description: t("message.send.text"),
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                  position: "top",
                });
                setDisableButton(true);
              } else {
                toast({
                  title: t("base:control.error"),
                  description: t("error.text"),
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                  position: "top",
                });
              }
            }}
          >
            <Stack spacing={4}>
              <FormControl id="category" isRequired>
                <FormLabel>{t("category")}</FormLabel>
                <Select name={"category"}>
                  <option value="sonstiges">{t("cat.other")}</option>
                  <option value="fehler">{t("cat.bug")}</option>
                  <option value="feature">{t("cat.feature")}</option>
                  <option
                    value="creator"
                    selected={router.query.creator !== undefined}
                  >
                    {t("cat.creator")}
                  </option>
                </Select>
              </FormControl>
              <FormControl id="title" isRequired>
                <FormLabel>{t("f.title")}</FormLabel>
                <Input name={"title"} placeholder={t("f.title")} />
              </FormControl>
              <FormControl id="message" isRequired>
                <FormLabel>{t("message")}</FormLabel>
                <Textarea name={"message"} placeholder={t("message")} />
              </FormControl>
              <Button type="submit" variant={"brand"} disabled={disableButton}>
                {loggedIn ? t("send") : t("send.login")}
              </Button>
            </Stack>
          </form>
          <DividerWithText text={t("base:or")} />
          <Text textAlign={"center"}>
            {t("email.to")}
            <Link pl={3} color={"brand.500"} href="mailto:hello@ben-siebert.de">
              hello@ben-siebert.de
            </Link>
          </Text>
        </Stack>
      </Flex>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["contact"])),
  };
}
