/**
 * src/components/community/profile/ProfileAvatarModifier.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.06.2022
 *
 */

import * as React from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import REST from "@codeup/rest";

export default function ProfileBannerModifier(props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [fileInvalid, setFileInvalid] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const toast = useToast();

  return (
    <>
      <Modal
        onClose={props.onClose}
        isOpen={props.isOpen}
        isCentered
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Banner hochladen</ModalHeader>
          <ModalCloseButton disabled={loading} />
          <ModalBody>
            {loading ? (
              <Spinner />
            ) : (
              <FormControl isInvalid={fileInvalid}>
                <FormLabel>Profil Banner</FormLabel>
                <input
                  type="file"
                  accept="image/svg+xml"
                  onChange={(e) => {
                    setFileInvalid(false);
                    // @ts-ignore
                    if (e.target.files.length > 0) {
                      // @ts-ignore
                      const file = e.target.files[0];

                      if (file.type.startsWith("image/")) {
                        if (file.size > 8 * 1024 * 1024) {
                          setFileInvalid(true);
                          return;
                        } else {
                          setLoading(true);
                          const formData = new FormData();
                          formData.append("uplFile", file);
                          fetch(
                            location.protocol.includes("s")
                              ? "https://upload.craftions.net/api/upload"
                              : "http://direct.craftions.net:9097/api/upload",
                            {
                              method: "POST",
                              body: formData,
                            }
                          ).then((res) => {
                            console.log(res);
                            res.text().then((data) => {
                              const url = "https://upload.craftions.net" + data;

                              REST.Community.updateProfile({
                                token: localStorage.getItem("token") as string,
                                update: {
                                  profileBanner: url,
                                },
                              }).then((res) => {
                                if (res.status === 200) {
                                  toast({
                                    title: "Profil aktualisiert",
                                    description:
                                      "Dein Profil wurde erfolgreich aktualisiert.",
                                    status: "success",
                                    position: "top",
                                    duration: 3000,
                                    onCloseComplete: () => {
                                      window.location.reload();
                                    },
                                  });
                                } else {
                                  toast({
                                    title: "Fehler",
                                    description:
                                      "Dein Profil konnte nicht aktualisiert werden.",
                                    status: "error",
                                  });
                                }
                              });
                            });
                          });
                        }
                      } else {
                        setFileInvalid(true);
                      }
                    }
                  }}
                />
                <FormErrorMessage>
                  Die hochgeladene Datei ist kein Bild oder ist größer als 8MB
                </FormErrorMessage>
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={props.onClose} disabled={loading}>
              Abbrechen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
