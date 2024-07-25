/**
 * apps/web/src/global/PopupManager/PromptPopupComponent.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.01.2023
 *
 */

import * as React from "react";
import { useId, useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { FaPen } from "react-icons/fa";
import PopupManager from "../PopupManager";

export default function PromptPopupComponent(props: {
  title: string;
  helperText: string;
  callback: (i: string) => void;
  onClose: () => void;
  inputType?: "INPUT" | "TEXTAREA";
}) {
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: true,
  });

  const whatEverRef = useRef();

  const id = useId();

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

            <AlertDialogBody>
              <FormControl isRequired>
                <FormLabel>
                  {PopupManager.__raw_get_translated_key("prompt.input")}
                </FormLabel>
                {props.inputType === "INPUT" ? (
                  <InputGroup>
                    <InputLeftElement>
                      <FaPen />
                    </InputLeftElement>
                    <Input
                      id={"input-" + id}
                      placeholder={PopupManager.__raw_get_translated_key(
                        "prompt.input"
                      )}
                    />
                  </InputGroup>
                ) : (
                  <Textarea
                    id={"input-" + id}
                    placeholder={PopupManager.__raw_get_translated_key(
                      "prompt.input"
                    )}
                  />
                )}
                <FormHelperText>{props.helperText}</FormHelperText>
              </FormControl>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={() => {
                  onClose();
                  props.onClose();
                }}
                // @ts-ignore
                ref={whatEverRef}
              >
                {PopupManager.__raw_get_translated_key("cancel")}
              </Button>
              <Button
                variant={"brand"}
                onClick={() => {
                  const data = document.getElementById(
                    "input-" + id
                  ) as HTMLInputElement;

                  props.callback(data.value);
                  onClose();
                  props.onClose();
                }}
                ml={3}
              >
                {PopupManager.__raw_get_translated_key("confirm")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
