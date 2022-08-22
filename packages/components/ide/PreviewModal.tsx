/**
 * packages/components/ide/PreviewModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.2022
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

export default function PreviewModal(props: {
  project: string | undefined;
  path: string | undefined;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const onClose = () => {
    props.onClose();
  };

  return (
    <>
      {props.project && props.path ? (
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
                src={
                  "/api/ide/projects/" + props.project + "/preview" + props.path
                }
              ></iframe>
            </ModalBody>

            <ModalFooter>
              <Button
                rightIcon={<FaExternalLinkAlt />}
                variant="outline"
                mr={3}
                onClick={() => {
                  window.open(
                    "/api/ide/projects/" +
                      props.project +
                      "/preview" +
                      props.path,
                    "_blank"
                  );
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
      ) : null}
    </>
  );
}
