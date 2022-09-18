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

export default function UserAuthAction(props: {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}) {
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        size={["full", "xl"]}
        isCentered
        scrollBehavior={"inside"}
      >
        <ModalOverlay backgroundColor={"black"} />
        <ModalContent backgroundColor={"black"}>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Tabs isFitted variant={"line"} colorScheme={"red"}>
              <TabList>
                <Tab>Registrieren</Tab>
                <Tab>Anmelden</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <UserAuthRegister />
                </TabPanel>
                <TabPanel>
                  <UserAuthLogin onClose={props.onClose} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Flex
              gap={"1.2rem"}
              direction={"row"}
              alignItems={"center"}
              justifyContent={"left"}
              w={"100%"}
            >
              <img src={"/codeup.svg"} width={64} height={64} />
              <Heading size={"lg"}>CodeUp</Heading>
            </Flex>
            <Button
              variant={"outline"}
              colorScheme={"red"}
              onClick={props.onClose}
            >
              Schließen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
