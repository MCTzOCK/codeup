/**
 * apps/web/src/pages/projects/[id]/uml/[uml_id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.06.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { IProject } from "../../../../types/IProject";
import { useEffect } from "react";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/editorv2/EditorProjectLayout";
import { IUMLDiagram } from "../../../../types/IUMLDiagram";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { FaCode, FaEye } from "react-icons/fa";
import UMLEditor from "@codeup/components/editorv2/uml/UMLEditor";
import UMLPreview from "@codeup/components/editorv2/uml/UMLPreview";
import { sProp } from "../../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function UMLViewer() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { t } = useTranslation("projects");

  const [project, setProject] = React.useState<IProject | null>(null);
  const [uml, setUml] = React.useState<IUMLDiagram | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then((res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
      } else {
        PopupManager.alertAsync({
          title: t("base:control.error"),
          description: t("project.loading.error") + ": " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  useEffect(() => {
    if (router && router.query && router.query.id && router.query.uml_id) {
      reloadUML();
    }
  }, [router, router.query, router.query.uml_id, router.query.id]);

  const reloadUML = async () => {
    const res = await REST.Projects.umlDiagrams(
      AccountManager.getActiveToken(),
      router.query.id as string,
      router.query.uml_id as string
    );

    if (res.status === 200) {
      setUml(res.payload.uml);
    } else {
      await PopupManager.alertAsync({
        title: t("base:control.error"),
        description: t("uml.loading.error") + ": " + res.payload.error,
      });
    }
  };

  return (
    <>
      <Head>
        <title>{t("uml.doc.title")}</title>
      </Head>
      <EditorProjectLayout project_id={router.query.id as string}>
        {!uml && (
          <>
            <AuthenticateLoadingIndicator text={t("uml.loading")} />
          </>
        )}
        {uml && (
          <>
            <Box p={2}>
              <Box textAlign={"center"}>
                <CHeading size={"lg"}>{uml.name}</CHeading>
              </Box>
              <Tabs variant={"brand"} colorScheme={"brand"} p={4}>
                <TabList w={"fit-content"} gap={4}>
                  <Tab>
                    <HStack gap={2} alignItems={"center"}>
                      <FaCode />
                      <Text>{t("uml.tab.code")}</Text>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack gap={2} alignItems={"center"}>
                      <FaEye />
                      <Text>{t("uml.tab.preview")}</Text>
                    </HStack>
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <UMLEditor
                      uml={uml}
                      updateUML={async (u) => {
                        setUml(u);

                        await REST.Projects.updateUmlDiagram(
                          AccountManager.getActiveToken(),
                          router.query.id as string,
                          router.query.uml_id as string,
                          u.data
                        );
                      }}
                    />
                  </TabPanel>
                  <TabPanel>
                    <UMLPreview
                      umlData={
                        JSON.parse(uml.data).content || "@startuml\n\n@enduml"
                      }
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </>
        )}
      </EditorProjectLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["projects"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
