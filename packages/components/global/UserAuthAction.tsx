/**
 * packages/components/global/UserAuthAction.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import * as React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import UserAuthRegister from "./UserAuthRegister";
import UserAuthLogin from "./UserAuthLogin";
import UserAuthReset from "./UserAuthReset";
import CodeUpModal from "../codeup/CodeUpModal";
import UserAuthSSO from "./UserAuthSSO";
import { useEffect } from "react";

export default function UserAuthAction(props: {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}) {
  useEffect(() => {
    window.addEventListener("codeup::open_login", props.onOpen);

    return () => {
      window.removeEventListener("codeup::open_login", props.onOpen);
    };
  });

  return (
    <>
      <CodeUpModal
        onOpen={props.onOpen}
        onClose={props.onClose}
        isOpen={props.isOpen}
      >
        <Tabs isFitted variant={"line"} colorScheme={"red"} flex={"50%"}>
          <TabList>
            <Tab>SSO</Tab>
            <Tab>Registrieren</Tab>
            <Tab>Anmelden</Tab>
            <Tab>Passwort Zurücksetzen</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <UserAuthSSO />
            </TabPanel>
            <TabPanel>
              <UserAuthRegister />
            </TabPanel>
            <TabPanel>
              <UserAuthLogin onClose={props.onClose} />
            </TabPanel>
            <TabPanel>
              <UserAuthReset />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CodeUpModal>
    </>
  );
}
