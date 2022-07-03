/**
 * src/components/community/post/PostMediaUploader.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2022
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
import { useTranslation } from "next-i18next";

export default function PostMediaUploader(props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  editor: any;
}) {
  const [fileInvalid, setFileInvalid] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Image</ModalHeader>
        <ModalCloseButton disabled={loading} />
        <ModalBody>
          {loading ? (
            <Spinner />
          ) : (
            <FormControl isInvalid={fileInvalid}>
              <FormLabel>Image</FormLabel>
              <input
                type="file"
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

                            props.editor
                              .chain()
                              .focus()
                              .setImage({ src: url })
                              .run();
                            props.onClose();
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
                The selected file is not an image or is over the limit of 8MB
              </FormErrorMessage>
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose} disabled={loading}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
