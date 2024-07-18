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

export default function DV2SProjects() {
  return (
    <>
      <CHeading size={"lg"} mb={4}>
        Deine Projekte
      </CHeading>
      <Text fontSize={"md"} pb={4}>
        Seit der Entstehung von CodeUp wurde besonders der Editor immer
        weiterentwickelt, sodass du heute die Auswahl zwischen den drei
        Versionen hast:
        <UnorderedList>
          <ListItem>
            <b>v1:</b> Der ursprüngliche Editor, welcher nur Frontend-Projekte
            unterstützt.
          </ListItem>
          <ListItem>
            <b>v2:</b> Eine weiterentwickelte Version, welche neben Frontend-
            auch Backend-Projekte unterstützt.
          </ListItem>
          <ListItem>
            <b>v3:</b> Die aktuell fortschrittlichste Version des CodeUp
            Editors, welcher neben der eigentlichen Programmierung auch
            zusätzliche Werkzeuge bietet!
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
        </TabPanels>
      </Tabs>
    </>
  );
}
