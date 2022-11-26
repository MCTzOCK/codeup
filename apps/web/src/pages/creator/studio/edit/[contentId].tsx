/**
 * apps/web/src/pages/creator/studio/edit/[contentId].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.11.2022
 *
 */

import * as React from "react";

import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest";
import CreatorStudioLayout from "@codeup/components/creator/studio/CreatorStudioLayout";
import { Button, ButtonGroup, Flex, Heading, useToast } from "@chakra-ui/react";
import Builder from "../../../../special-components/Builder";

export default function ContentEditor() {
  const router = useRouter();

  const { contentId } = router.query;

  const [content, setContent] = React.useState<{
    _id: string;
    displayName: string;
    course: string;
    url: string;
    textContent: string;
    quiz: {
      question: string;
      answers: {
        answer: string;
        correct: boolean;
      }[];
    };
  }>();

  const toast = useToast();

  const [custom_event_id, setCustomEventId] = React.useState<string>("");

  useEffect(() => {
    if (contentId) {
      REST.Creator.getContents({
        token: localStorage.getItem("token") as string,
        contentId: contentId as string,
      }).then((res) => {
        if (res.status === 200) {
          setContent(res.payload.content);
          setCustomEventId(randomString());
        } else {
          toast({
            title: "Fehler",
            description: "Fehler beim Laden: " + res.payload.error,
            status: "error",
            duration: 1500,
            isClosable: true,
            position: "bottom-left",
          });
        }
      });
    }
  }, [router, contentId]);

  return (
    <CreatorStudioLayout>
      <Heading mt={"2rem"} size="2xl" textAlign={"center"}>
        Inhalt bearbeiten
      </Heading>
      {content ? (
        <>
          <Flex flexDir="column" width="100%" p={"5rem"} minH={"100vh"}>
            <Builder
              content={content.textContent}
              custom_event_id={custom_event_id}
            />
            <ButtonGroup
              mt={"2rem"}
              w={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Button
                fontSize={"2xl"}
                size={"lg"}
                colorScheme={"red"}
                onClick={async () => {
                  const res = await REST.Creator.updateContent({
                    token: localStorage.getItem("token") as string,
                    cid: content._id,
                    update: {
                      textContent: "__codeup.__no_text_content",
                    },
                  });
                  if (res.status === 200) {
                    router.back();
                  } else {
                    toast({
                      title: "Fehler",
                      description:
                        "Fehler beim Speichern: " + res.payload.error,
                      status: "error",
                      duration: 1500,
                      isClosable: true,
                      position: "bottom-left",
                    });
                  }
                }}
              >
                Inhalt Löschen
              </Button>
              <Button
                fontSize={"2xl"}
                size={"lg"}
                colorScheme={"red"}
                onClick={() => {
                  router.back();
                }}
              >
                Abbrechen
              </Button>
              <Button
                fontSize={"2xl"}
                size={"lg"}
                colorScheme={"green"}
                onClick={async () => {
                  window.dispatchEvent(
                    new CustomEvent(
                      "codeup::webbuilder::export_" + custom_event_id
                    )
                  );

                  const mergedCode =
                    // @ts-ignore
                    window.codeup.webBuilderHTMLExport;

                  // @ts-ignore
                  delete window.codeup.webBuilderHTMLExport;

                  const res = await REST.Creator.updateContent({
                    token: localStorage.getItem("token") as string,
                    cid: content._id,
                    update: {
                      textContent: mergedCode,
                    },
                  });

                  if (res.status === 200) {
                    router.back();
                  } else {
                    toast({
                      title: "Fehler",
                      description:
                        "Fehler beim Speichern: " + res.payload.error,
                      status: "error",
                      duration: 1500,
                      isClosable: true,
                      position: "bottom-left",
                    });
                  }
                }}
              >
                Speichern
              </Button>
            </ButtonGroup>
          </Flex>
        </>
      ) : null}
    </CreatorStudioLayout>
  );
}

function randomString(length: number = 32) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}
