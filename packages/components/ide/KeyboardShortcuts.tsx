/**
 * packages/components/ide/KeyboardShortcuts.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.07.2022
 *
 */

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Kbd,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

export default function KeyboardShortcuts(props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <Modal
        onClose={props.onClose}
        isOpen={props.isOpen}
        isCentered
        size={["full", "xl"]}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tastenkürzel</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Tastenkürzel</Th>
                    <Th>Aktion</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>
                      <Kbd>STRG</Kbd> + <Kbd>S</Kbd>
                    </Td>
                    <Td>Speichern</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>STRG</Kbd> + <Kbd>O</Kbd>
                    </Td>
                    <Td>Datei Öffnen</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>STRG</Kbd> + <Kbd>C</Kbd>
                    </Td>
                    <Td>Kopieren</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>STRG</Kbd> + <Kbd>V</Kbd>
                    </Td>
                    <Td>Einfügen</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>STRG</Kbd> + <Kbd>Z</Kbd>
                    </Td>
                    <Td>Ausschneiden</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>STRG</Kbd> + <Kbd>F</Kbd>
                    </Td>
                    <Td>Suchen</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>STRG</Kbd> + <Kbd>H</Kbd>
                    </Td>
                    <Td>Ersetzen</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>STRG</Kbd> + <Kbd>ALT</Kbd> + <Kbd>F</Kbd>
                    </Td>
                    <Td>Formatieren</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>STRG</Kbd> + <Kbd>G</Kbd>
                    </Td>
                    <Td>Zu Zeile springen</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>STRG</Kbd> + <Kbd>Z</Kbd>
                    </Td>
                    <Td>Rückgängig</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>STRG</Kbd> + <Kbd>Y</Kbd>
                    </Td>
                    <Td>Wiederherstellen</Td>
                  </Tr>
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>Tastenkürzel</Th>
                    <Th>Aktion</Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            <Button onClick={props.onClose} variant={"outline"}>
              Schließen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
