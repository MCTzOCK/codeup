/**
 * apps/web/src/global/PopupManager/ConfirmPopupComponent.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.01.2023
 *
 */

import * as React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import PopupManager from "../PopupManager";

export default function ConfirmPopupComponent(props: {
  title: string;
  question: string;
  onClose: () => void;
  approve: () => void;
  deny: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: true,
  });
  const whatEverRef = React.useRef();
  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        onClose={() => {
          onClose();
          props.onClose();
        }}
        isCentered
        // @ts-ignore
        leastDestructiveRef={whatEverRef}
      >
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)">
          <AlertDialogContent bg={"black"}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {props.title}
            </AlertDialogHeader>

            <AlertDialogBody>{props.question}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={() => {
                  onClose();
                  props.deny();
                  props.onClose();
                }}
                // @ts-ignore
                ref={whatEverRef}
              >
                {PopupManager.__raw_get_translated_key("confirm.no")}
              </Button>
              <Button
                variant="brand"
                onClick={() => {
                  onClose();
                  props.approve();
                  props.onClose();
                }}
                ml={3}
              >
                {PopupManager.__raw_get_translated_key("confirm.yes")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
