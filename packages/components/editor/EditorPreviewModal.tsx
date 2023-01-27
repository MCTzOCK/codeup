/**
 * packages/components/editor/EditorPreviewModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.01.23
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
import { FaExternalLinkAlt } from "react-icons/fa";

export default function EditorPreviewModal(props: {
  url: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const onClose = () => {
    props.onClose();
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={onClose} size={"full"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Vorschau</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <iframe
              width={"100%"}
              style={{ border: "none", height: "80vh" }}
              id={"ifr-prev"}
              src={props.url}
            ></iframe>
          </ModalBody>

          <ModalFooter>
            <Button
              rightIcon={<FaExternalLinkAlt />}
              variant="outline"
              mr={3}
              onClick={() => {
                window.open(props.url, "_blank");
              }}
            >
              In neuem Tab öffnen
            </Button>

            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                const iframe = document.getElementById(
                  "ifr-prev"
                ) as HTMLIFrameElement;

                if (iframe.requestFullscreen) {
                  iframe.requestFullscreen();
                  // @ts-ignore
                } else if (iframe.webkitRequestFullscreen) {
                  // @ts-ignore
                  iframe.webkitRequestFullscreen();
                  // @ts-ignore
                } else if (iframe.mozRequestFullScreen) {
                  // @ts-ignore
                  iframe.mozRequestFullScreen();
                  // @ts-ignore
                } else if (iframe.msRequestFullscreen) {
                  // @ts-ignore
                  iframe.msRequestFullscreen();
                }
              }}
            >
              Vollbild
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
