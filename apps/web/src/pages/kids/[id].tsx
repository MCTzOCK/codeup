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
import { Box, Button, Flex } from "@chakra-ui/react";
import BlocklyEditor from "@codeup/util/dist/blockly/BlocklyEditor";
import { BlocklyCompiler } from "@codeup/util/dist/blockly/blockly/BlocklyCompiler";
import { FaPlay, FaSave } from "react-icons/fa";
import Blockly from "blockly";

export default function ProjectViewer() {
  const [project, setProject] = React.useState<{
    _id: string;
    name: string;
    code: string;
    owner: string;
  }>();

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
          title: "Fehler",
          description: "Es ist ein Fehler aufgetreten: " + res.payload.error,
        });
        return;
      }

      setProject(res.payload.project);
    });
  }, [loggedIn, loaded]);

  return (
    <>
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

                  const html = new BlocklyCompiler().compile();

                  iframe.srcdoc = html;
                }}
                leftIcon={<FaPlay />}
                mt={[0, 8]}
                ml={[8, 0]}
                colorScheme={"green"}
              >
                Run
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
                      title: "Fehler",
                      description:
                        "Es ist ein Fehler aufgetreten: " + res.payload.error,
                    });
                    return;
                  }

                  PopupManager.alertAsync({
                    title: "Erfolgreich",
                    description: "Das Projekt wurde erfolgreich gespeichert!",
                  });
                }}
                leftIcon={<FaSave />}
                mt={[0, 8]}
                ml={[8, 0]}
              >
                Speichern
              </Button>
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
