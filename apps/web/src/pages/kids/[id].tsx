/**
 * apps/web/src/pages/kids/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.04.2023
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { useRouter } from "next/router";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import REST from "@codeup/rest/src/index";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../global/PopupManager";
import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";
import BlocklyEditor from "@codeup/incode-blockly/dist/BlocklyEditor";
import { BlocklyCompiler } from "@codeup/util/dist/blockly/blockly/BlocklyCompiler";
import { FaCode, FaPlay, FaSave } from "react-icons/fa";
import Blockly from "blockly";
import * as InCode from "@codeup/incode-compiler";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function ProjectViewer() {
  const [project, setProject] = React.useState<{
    _id: string;
    name: string;
    code: string;
    owner: string;
  }>();

  const { t } = useTranslation("kids");

  const { loggedIn, loaded, userInfo } = useLoggedIn();

  const router = useRouter();

  React.useEffect(() => {
    if (loaded && !loggedIn) {
      router.push("/#login");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
      return;
    }

    if (!router.query.id) return;

    REST.Kids.getProject({
      token: AccountManager.getActiveToken(),
      id: router.query.id as string,
    }).then((res) => {
      if (res.status !== 200) {
        PopupManager.alertAsync({
          title: t("base:control.error"),
          description: t("base:control.error.request") + res.payload.error,
        });
        return;
      }

      setProject(res.payload.project);
    });
  }, [loggedIn, loaded]);

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      {!loaded || !project || !project.code ? (
        <>
          <AuthenticateLoadingIndicator />
        </>
      ) : (
        <>
          <Flex
            w={"100%"}
            minH={"100vh"}
            h={"fit-content"}
            direction={["column", "row"]}
            gap={"2rem"}
            bg={"#000"}
          >
            <Box w={"100%"} h={"100vh"} flex={"100%"}>
              <BlocklyEditor initialXml={project?.code as string} />
            </Box>
            <Box flex={"5%"}>
              <Button
                onClick={() => {
                  const iframe = document.getElementById(
                    "codeup-kids_preview"
                  ) as HTMLIFrameElement;

                  const incode = new InCode.BlocklyCompiler().compile();
                  const html = InCode.Compiler.compile(incode);

                  console.log(incode, html);

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
                onClick={async () => {
                  const res = await REST.Kids.updateProject({
                    token: AccountManager.getActiveToken(),
                    id: project?._id as string,
                    code: Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace())
                      .outerHTML,
                  });

                  if (res.status !== 200) {
                    PopupManager.alertAsync({
                      title: t("base:control.error"),
                      description:
                        t("base:control.error.request") + res.payload.error,
                    });
                    return;
                  }

                  PopupManager.alertAsync({
                    title: t("successful"),
                    description: t("successful.saved"),
                  });
                }}
                leftIcon={<FaSave />}
                mt={[0, 8]}
                ml={[8, 0]}
                variant={"brand"}
              >
                {t("save")}
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
                id={"codeup-kids_preview"}
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
      )}
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["kids"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
