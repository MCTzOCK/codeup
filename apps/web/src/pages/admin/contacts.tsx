/**
 * apps/web/src/pages/admin/contacts.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.11.2022
 *
 */

import * as React from "react";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import REST from "@codeup/rest";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import DataTable from "@codeup/components/extra/DataTable";
import { FaTrash } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import CodeUpModal from "@codeup/components/codeup/CodeUpModal";

export default function Contacts() {
  const [messages, setMessages] = React.useState<
    {
      _id: string;
      message: string;
      title: string;
      username: string;
      category: string;
      createdAt: string;
    }[]
  >([]);

  const toast = useToast();

  const reload = () => {
    REST.Admin.getContactMessages(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setMessages(res.payload.messages);
        } else {
          toast({
            title: "Fehler",
            description: "Es ist ein Fehler aufgetreten: " + res.payload.error,
            status: "error",
            duration: 1500,
            isClosable: true,
            position: "bottom-right",
          });
        }
      }
    );
  };

  React.useEffect(() => {
    reload();
  }, []);

  const { onOpen, isOpen, onClose } = useDisclosure();
  const [selected, setSelected] = React.useState<string>("");

  const messageToRow = (msg: {
    _id: string;
    message: string;
    title: string;
    username: string;
    category: string;
    createdAt: string;
  }) => {
    return [
      () => {},
      <Avatar size={"md"} src={"/api/account/" + msg.username + "/picture"} />,
      msg.username,
      msg.title,
      msg.category,
      msg.message,
      new Date(msg.createdAt).toLocaleString(),
      <>
        <ButtonGroup isAttached>
          <IconButton
            aria-label={"delete"}
            icon={<FaTrash />}
            colorScheme={"red"}
            onClick={() => {
              REST.Admin.deleteContactMessage({
                token: localStorage.getItem("token") as string,
                id: msg._id,
              }).then((res) => {
                if (res.status === 200) {
                  toast({
                    title: "Erfolgreich",
                    description: "Nachricht gelöscht",
                    status: "success",
                    duration: 1500,
                    isClosable: true,
                    position: "bottom-right",
                  });
                  reload();
                } else {
                  toast({
                    title: "Fehler",
                    description:
                      "Es ist ein Fehler aufgetreten: " + res.payload.error,
                    status: "error",
                    duration: 1500,
                    isClosable: true,
                    position: "bottom-right",
                  });
                }
              });
            }}
          />
          <IconButton
            aria-label={"delete"}
            colorScheme={"blue"}
            onClick={() => {
              setSelected(msg.username);
              onOpen();
            }}
            icon={<FiMail />}
          />
        </ButtonGroup>
      </>,
    ];
  };

  return (
    <AdminLayout>
      <Heading
        as="h1"
        size="2xl"
        fontWeight="bold"
        textAlign="center"
        mt={10}
        mb={10}
      >
        Nachrichten
      </Heading>
      <Flex justifyContent={"center"} w={"100%"}>
        <Box maxW={"75%"} w={"100%"}>
          <DataTable
            columns={[
              "Profilbild",
              "Benutzer",
              "Titel",
              "Kategorie",
              "Nachricht",
              "Datum",
              "Aktion",
            ]}
            data={messages.map(messageToRow)}
            filter={(q: string, f: string, s: string) => {
              let x = messages;

              if (s === "Neuste Zuerst") {
                x = x.sort((a, b) => {
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                });
              } else if (s === "Älteste Zuerst") {
                x = x.sort((a, b) => {
                  return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                  );
                });
              }

              x = x.filter((m) => {
                return (
                  m.username.toLowerCase().includes(q.toLowerCase()) ||
                  m.title.toLowerCase().includes(q.toLowerCase()) ||
                  m.category.toLowerCase().includes(q.toLowerCase()) ||
                  m.message.toLowerCase().includes(q.toLowerCase())
                );
              });

              return x.map(messageToRow);
            }}
            filterOptions={["Alle"]}
            sortOptions={["Neuste Zuerst", "Älteste Zuerst"]}
            reload={reload}
          />
        </Box>
      </Flex>
      <CodeUpModal
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        title={"Nachricht an " + selected}
        customSize={"md"}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const form = e.target as HTMLFormElement;

            const data = new FormData(form);

            const message = data.get("message") as string;

            const res = await REST.Admin.contactUser({
              token: localStorage.getItem("token") as string,
              username: selected,
              message,
            });

            if (res.status === 200) {
              toast({
                title: "Erfolgreich",
                description: "Nachricht gesendet",
                status: "success",
                duration: 1500,
                isClosable: true,
                position: "bottom-right",
              });
              onClose();
            } else {
              toast({
                title: "Fehler",
                description:
                  "Es ist ein Fehler aufgetreten: " + res.payload.error,
                status: "error",
                duration: 1500,
                isClosable: true,
                position: "bottom-right",
              });
            }
          }}
        >
          <FormControl>
            <FormLabel>Nachricht</FormLabel>
            <Textarea placeholder={"Nachricht"} name={"message"} />
          </FormControl>
          <Button colorScheme={"blue"} mt={"2rem"} type={"submit"}>
            Senden
          </Button>
        </form>
      </CodeUpModal>
    </AdminLayout>
  );
}
