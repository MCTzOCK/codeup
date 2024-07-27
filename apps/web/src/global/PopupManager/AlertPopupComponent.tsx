/**
 * apps/web/src/global/PopupManager/AlertPopupComponent.tsx
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

export default function AlertPopupComponent(props: {
  title: string | undefined;
  description: string | React.ReactNode;
  customSize?: string;
  onClose: () => void;
  inputType?: "INPUT" | "TEXTAREA";
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
        size={props.customSize ? props.customSize : "md"}
      >
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)">
          <AlertDialogContent bg={"black"}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {props.title
                ? props.title
                : PopupManager.__raw_get_translated_key("alert")}
            </AlertDialogHeader>

            <AlertDialogBody>{props.description}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                variant="brand"
                onClick={() => {
                  onClose();
                  props.onClose();
                }}
                ml={3}
              >
                {PopupManager.__raw_get_translated_key("close")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
