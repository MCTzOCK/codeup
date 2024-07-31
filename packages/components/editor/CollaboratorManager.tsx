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
import { useTranslation } from "next-i18next";

export default function CollaboratorManager(props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  projectId: string | undefined;
  socket: Socket;
}) {
  const { t } = useTranslation("editor");
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
          <ModalHeader>{t("contributors.manage")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CollaboratorManagerBody
              projectId={props.projectId}
              socket={props.socket}
            />
          </ModalBody>

          <ModalFooter>
            <Button variant={"brand"} mr={3} onClick={props.onClose}>
              {t("close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
