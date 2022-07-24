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
    // document.cookie = "jwt=; path=/";
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
                Vollbild
              </Button>
              <Button variant="outline" mr={3} onClick={onClose}>
                Schließen
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : null}
    </>
  );
}
