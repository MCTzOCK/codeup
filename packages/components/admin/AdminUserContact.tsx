/**
 * packages/components/admin/AdminUserContact.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.04.2023
 *
 */

import * as React from "react";
import CodeUpModal from "../codeup/CodeUpModal";
import REST from "@codeup/rest/dist";
import {
  Button,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
} from "@chakra-ui/react";

export default function AdminUserContact(props: {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  title: string;
  username: string;
}) {
  const toast = useToast();

  return (
    <CodeUpModal
      onOpen={props.onOpen}
      onClose={props.onClose}
      isOpen={props.isOpen}
      title={props.title}
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
            username: props.username,
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
            props.onClose();
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
  );
}
