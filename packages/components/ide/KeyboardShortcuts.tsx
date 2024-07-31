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
import * as React from "react";
import { useTranslation } from "next-i18next";

export default function KeyboardShortcuts(props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation("ide");
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
          <ModalHeader>{t("keyboard.shortcuts")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>{t("keyboard.shortcuts")}</Th>
                    <Th>{t("action")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>
                      <Kbd>{t("keyboard.ctrl")}</Kbd> + <Kbd>S</Kbd>
                    </Td>
                    <Td>{t("keyboard.save")}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>{t("keyboard.ctrl")}</Kbd> + <Kbd>O</Kbd>
                    </Td>
                    <Td>{t("keyboard.open.file")}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>{t("keyboard.ctrl")}</Kbd> + <Kbd>C</Kbd>
                    </Td>
                    <Td>{t("keyboard.copy")}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>{t("keyboard.ctrl")}</Kbd> + <Kbd>V</Kbd>
                    </Td>
                    <Td>{t("keyboard.past")}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>{t("keyboard.ctrl")}</Kbd> + <Kbd>Z</Kbd>
                    </Td>
                    <Td>{t("keyboard.cut")}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>{t("keyboard.ctrl")}</Kbd> + <Kbd>F</Kbd>
                    </Td>
                    <Td>{t("keyboard.search")}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>{t("keyboard.ctrl")}</Kbd> + <Kbd>H</Kbd>
                    </Td>
                    <Td>{t("keyboard.replace")}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>{t("keyboard.ctrl")}</Kbd> + <Kbd>ALT</Kbd> +{" "}
                      <Kbd>F</Kbd>
                    </Td>
                    <Td>{t("keyboard.format")}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>{t("keyboard.ctrl")}</Kbd> + <Kbd>G</Kbd>
                    </Td>
                    <Td>{t("keyboard.jump")}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>{t("keyboard.ctrl")}</Kbd> + <Kbd>Z</Kbd>
                    </Td>
                    <Td>{t("keyboard.undo")}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Kbd>{t("keyboard.ctrl")}</Kbd> + <Kbd>Y</Kbd>
                    </Td>
                    <Td>{t("keyboard.redo")}</Td>
                  </Tr>
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>{t("keyboard.shortcuts")}</Th>
                    <Th>{t("action")}</Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            <Button onClick={props.onClose} variant={"outline"}>
              {t("close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
