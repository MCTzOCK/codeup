/**
 * src/components/community/post/PostButton.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2022
 *
 */

import * as React from "react";
import { useState } from "react";
import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import TipTap from "./TipTap";

export default function PostButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState("");

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={["full", "4xl"]}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody padding={"2rem"}>
            <TipTap />
          </ModalBody>
        </ModalContent>
      </Modal>

      <div
        style={{
          position: "fixed",
          right: "5%",
          bottom: "5%",
          display: "block",
        }}
      >
        <IconButton
          aria-label={"Post"}
          icon={<FaPlus />}
          size={"lg"}
          colorScheme={"whatsapp"}
          onClick={onOpen}
        />
      </div>
    </>
  );
}
