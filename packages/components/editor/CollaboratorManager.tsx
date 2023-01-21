/**
 * packages/components/editor/CollaboratorManager.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.01.2023
 *
 */

import * as React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Socket } from "socket.io-client";
import CollaboratorManagerBody from "./CollaboratorManagerBody";

export default function CollaboratorManager(props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  projectId: string | undefined;
  socket: Socket;
}) {
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        size={["full", "5xl"]}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mitwirkende verwalten</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CollaboratorManagerBody
              projectId={props.projectId}
              socket={props.socket}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={props.onClose}>
              Schließen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
