/**
 * packages/components/codeup/CodeUpModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import * as React from "react";
import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

export default function CodeUpModal(props: {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  noCloseButton?: boolean;
  children: React.ReactNode;
  title?: string;
  blackBackground?: boolean;
  customSize?: string | string[];
}) {
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        size={props.customSize ? props.customSize : ["full", "2xl"]}
        isCentered
        scrollBehavior={"inside"}
      >
        <ModalOverlay
          bg={props.blackBackground ? "black" : "blackAlpha.300"}
          backdropFilter={props.blackBackground ? "blur(0px)" : "blur(10px)"}
        />
        <ModalContent backgroundColor={"black"}>
          <ModalHeader>
            {props.title ? <Heading size={"lg"}>{props.title}</Heading> : null}
            {!props.noCloseButton ? <ModalCloseButton /> : null}
          </ModalHeader>
          <ModalBody>{props.children}</ModalBody>
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
            {!props.noCloseButton ? (
              <Button variant={"brand"} onClick={props.onClose}>
                Schließen
              </Button>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
