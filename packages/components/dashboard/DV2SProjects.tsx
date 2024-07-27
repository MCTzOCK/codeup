/**
 * packages/components/dashboard/DV2SProjects.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.07.2024
 *
 */

import * as React from "react";
import { CHeading } from "../global/CHeading";
import {
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import DV2SSProjectsV1 from "./DV2SSProjectsV1";
import DV2SSProjectsV2 from "./DV2SSProjectsV2";
import DV2SSProjectsV3 from "./DV2SSProjectsV3";
import { useTranslation } from "next-i18next";

export default function DV2SProjects() {
  const { t } = useTranslation("dashboard");
  return (
    <>
      <CHeading size={"lg"} mb={4}>
        {t("projects.title")}
      </CHeading>
      <Text fontSize={"md"} pb={4}>
        {t("projects.text")}
        <UnorderedList>
          <ListItem>
            <b>v1:</b> {t("projects.v1")}
          </ListItem>
          <ListItem>
            <b>v2:</b> {t("projects.v2")}
          </ListItem>
          <ListItem>
            <b>v3:</b> {t("projects.v3")}
          </ListItem>
        </UnorderedList>
      </Text>
      <Tabs variant={"brand"} isFitted isLazy>
        <TabList>
          <Tab>v1</Tab>
          <Tab>v2</Tab>
          <Tab>v3</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DV2SSProjectsV1 />
          </TabPanel>
          <TabPanel>
            <DV2SSProjectsV2 />
          </TabPanel>
          <TabPanel>
            <DV2SSProjectsV3 />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
