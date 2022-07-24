/**
 * packages/components/ide/TemplatePublisher.tsx
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
  chakra,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import REST from "@codeup/rest";
import { useRouter } from "next/router";

export default function TemplatePublisher(props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  projectId: string;
}) {
  const toast = useToast();

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const target = e.target as HTMLFormElement;

              const displayName = (
                target.elements.namedItem("displayName") as HTMLInputElement
              ).value;
              const description = (
                target.elements.namedItem("description") as HTMLTextAreaElement
              ).value;

              if (displayName.length < 4) {
                toast({
                  status: "error",
                  position: "top",
                  isClosable: true,
                  duration: 3000,
                  variant: "solid",
                  title: "Fehler",
                  description:
                    "Der Anzeigename muss mindestens 4 Buchstaben lang sein.",
                });
                return;
              }

              if (description.length < 50) {
                toast({
                  status: "error",
                  position: "top",
                  isClosable: true,
                  duration: 3000,
                  variant: "solid",
                  title: "Fehler",
                  description:
                    "Die Beschreibung muss mindestens 50 Buchstaben lang sein.",
                });
                return;
              }

              const res = await REST.IDE.publishTemplate({
                token: localStorage.getItem("token") as string,
                projectId: props.projectId,
                displayName,
                description,
              });

              toast({
                status: "success",
                position: "top",
                isClosable: true,
                duration: 3000,
                variant: "solid",
                title: "Erfolgreich",
                description: "Die Vorlage wurde veröffentlicht",
                onCloseComplete: () => {
                  window.location.reload();
                },
              });
            }}
          >
            <ModalHeader>Vorlage Veröffentlichen</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Anzeigename</FormLabel>
                <Input
                  type={"text"}
                  placeholder={"Anzeigename"}
                  id={"displayName"}
                  name={"displayName"}
                />
              </FormControl>
              <FormControl mt={"2rem"}>
                <FormLabel>Beschreibung</FormLabel>
                <Textarea
                  placeholder={"Beschreibung"}
                  id={"description"}
                  name={"description"}
                />
              </FormControl>
              <Text mt={"2rem"}>
                <chakra.b color={"red.400"}>Disclaimer:</chakra.b>
                <br />
                Wenn du eine Vorlage veröffentlichst, kann jeder Benutzer den
                kompletten Code deines Projektes einsehen. Bearbeiten können
                weiterhin nur die von dir hinzugefügten Mitwirkenden.
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button variant={"outline"} mr={3} onClick={props.onClose}>
                Abbrechen
              </Button>
              <Button variant="solid" colorScheme={"blue"} type={"submit"}>
                Veröffentlichen
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
