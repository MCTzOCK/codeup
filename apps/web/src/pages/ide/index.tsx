/**
 * apps/web/src/pages/ide/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.07.2022
 *
 */
import * as React from "react";
import { useEffect } from "react";
import redirect from "@codeup/util/src/userworkflow/redirect";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaPlus, FaRegFolderOpen } from "react-icons/fa";
import CreateProjectMenu from "@codeup/components/ide/CreateProjectMenu";
import OpenProjectMenu from "@codeup/components/ide/OpenProjectMenu";
import Head from "next/head";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function Index() {
  useEffect(() => {
    redirect({
      forceAnonymous: false,
      allowAnonymous: false,
      redirectToLogin: true,
      redirectTo: "/ide",
    });
  });

  const { t } = useTranslation("ide");

  const [currentComponent, setCurrentComponent] =
    React.useState<JSX.Element | null>(
      <>
        <Spinner size="xl" />
      </>
    );

  const [currentSelected, setCurrentSelected] =
    React.useState<string>("create");
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.has("component")) {
      switch (query.get("component")) {
        case "create":
          setCurrentComponent(<CreateProjectMenu />);
          setCurrentSelected("create");
          break;
        default:
          setCurrentComponent(<OpenProjectMenu />);
          setCurrentSelected("open");
          break;
      }
    } else {
      router.push("/ide?component=create");
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      <Flex direction={["column", "row"]} minW={"100%"} minH={"100vh"}>
        <Flex
          direction={"column"}
          flex={"15%"}
          minH={"100%"}
          bgColor={"black"}
          p={"1.2rem"}
        >
          <Box textAlign={"center"}>
            <CHeading size={"xl"}>{t("projects")}</CHeading>
          </Box>
          <Button
            m={"1.2rem"}
            justifyContent={"flex-start"}
            variant={currentSelected === "create" ? "brand" : "ghost"}
            leftIcon={<FaPlus />}
            onClick={() => {
              router.push("/ide?component=create");
            }}
          >
            {t("new")}
          </Button>
          <Button
            marginInline={"1.2rem"}
            justifyContent={"flex-start"}
            variant={currentSelected === "open" ? "brand" : "ghost"}
            leftIcon={<FaRegFolderOpen />}
            onClick={() => {
              setCurrentSelected("account");
              router.push("/ide?component=open");
            }}
          >
            {t("projects.my")}
          </Button>
        </Flex>
        <Flex direction={"column"} flex={"85%"} minH={"100%"} bg={"#000"}>
          {currentComponent}
        </Flex>
      </Flex>
    </>
  );
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["ide"])),
  };
}
