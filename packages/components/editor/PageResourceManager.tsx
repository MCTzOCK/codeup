/**
 * packages/components/editor/PageResourceManager.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.01.23
 *
 */

import * as React from "react";
import { Socket } from "socket.io-client";
import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

export default function PageResourceManager(props: {
  resources: {
    name: string;
    type: string;
    content: string;
  }[];
  socket: Socket;
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}) {
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        size={["full", "2xl"]}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Resourcen verwalten</ModalHeader>
            <ModalCloseButton />
            <ModalBody></ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
