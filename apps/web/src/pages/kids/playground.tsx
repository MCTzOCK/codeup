/**
 * apps/web/src/pages/kids/playground.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.04.2023
 *
 */

import * as React from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import BlocklyEditor from "@codeup/incode-blockly/dist/BlocklyEditor";
//import { BlocklyCompiler } from "@codeup/incode-blockly/dist/blockly/BlocklyCompiler";
import { FaCode, FaPlay } from "react-icons/fa";
import * as InCode from "@codeup/incode-compiler/dist";
import PopupManager from "../../global/PopupManager";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Playground() {
  const { t } = useTranslation("kids");
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{t("playground.doc.title")}</title>
      </Head>
      <Flex
        w={"100%"}
        minH={"100vh"}
        h={"fit-content"}
        direction={["column", "row"]}
        gap={"2rem"}
        bg={"#000"}
      >
        <Box w={"100%"} h={"100vh"} flex={"100%"}>
          <BlocklyEditor
            initialXml={
              '<xml><block type="start" id="|(^9%DCME)E4UEoWv~G]" x="134" y="70"></block></xml>'
            }
          />
        </Box>
        <Box flex={"5%"}>
          <Button
            onClick={() => {
              const iframe = document.getElementById(
                "codeup-kids_playground_preview"
              ) as HTMLIFrameElement;

              const incode = new InCode.BlocklyCompiler().compile();
              const html = InCode.Compiler.compile(incode);

              iframe.srcdoc =
                "<html><body><script defer async>" +
                html +
                "</script></body></html>";
            }}
            leftIcon={<FaPlay />}
            mt={[0, 8]}
            ml={[8, 0]}
            variant={"brand"}
          >
            {t("playground.run")}
          </Button>
          <Button
            variant={"brand"}
            mt={[0, 8]}
            w={"100%"}
            leftIcon={<FaCode />}
            onClick={async () => {
              const incode = new InCode.BlocklyCompiler().compile();
              const html = InCode.Compiler.compile(incode);

              await PopupManager.alertAsync({
                title: "JavaScript Code",
                description: (
                  <>
                    <pre
                      style={{
                        overflow: "scroll",
                      }}
                    >
                      {html}
                    </pre>
                  </>
                ),
                customSize: "2xl",
              });
            }}
          >
            {t("playground.code")}
          </Button>
          {router.locale !== "de" && (
            <>
              <Text mt={[0, 8]}>{t("playground.translation.error")}</Text>
            </>
          )}
        </Box>
        <Box flex={"100%"}>
          <iframe
            id={"codeup-kids_playground_preview"}
            width={"100%"}
            height={"100vh"}
            style={{
              border: "none",
              height: "100vh",
            }}
          ></iframe>
        </Box>
      </Flex>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["kids"])),
  };
}
