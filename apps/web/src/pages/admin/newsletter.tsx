/**
 * apps/web/src/pages/admin/newsletter.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.04.2023
 *
 */

import * as React from "react";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  Input,
  InputGroup,
  Text,
  Textarea,
} from "@chakra-ui/react";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import PopupManager from "../../global/PopupManager";

export default function Newsletter() {
  const [newsletterMembers, setNewsletterMembers] = React.useState<number>(0);
  const [error, setError] = React.useState<boolean>(false);

  React.useEffect(() => {
    REST.Admin.getNewsletterMembers({
      token: AccountManager.getActiveToken(),
      count: true,
    }).then((res) => {
      if (res.status === 200) {
        setNewsletterMembers(res.payload.count);
      } else {
        setError(true);
      }
    });
  }, []);

  return (
    <>
      <AdminLayout>
        <Box mt={8}></Box>
        <SuperText>Newsletter</SuperText>
        {error ? (
          <>
            <ErrorComponent description={"Ein Fehler ist aufgetreten!"} />
          </>
        ) : (
          <>
            <Text textAlign={"center"} fontSize={"lg"} mt={4}>
              Es sind {newsletterMembers} Mitglieder in der Newsletterliste
            </Text>
            <Flex
              w={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
              mt={8}
            >
              <Box
                bg={"black"}
                rounded={"xl"}
                w={["100%", "50%"]}
                boxShadow={"xl"}
                p={4}
              >
                <Heading
                  textAlign={"center"}
                  size={"lg"}
                  fontWeight={"extrabold"}
                >
                  Neuer Newsletter
                </Heading>
                <Divider mt={4} />
                <Input placeholder={"Titel"} mt={4} id={"newsletter-title"} />
                <Textarea
                  w={"100%"}
                  resize={"vertical"}
                  placeholder={"Inhalt des Newsletters"}
                  mt={4}
                  minH={"45vh"}
                  id={"newsletter-content"}
                />
                <Button
                  w={"100%"}
                  colorScheme={"green"}
                  mt={4}
                  onClick={async () => {
                    const title = (
                      document.getElementById(
                        "newsletter-title"
                      ) as HTMLInputElement
                    ).value;
                    const content = (
                      document.getElementById(
                        "newsletter-content"
                      ) as HTMLInputElement
                    ).value;

                    const res = await REST.Admin.sendNewsletter({
                      token: AccountManager.getActiveToken(),
                      content,
                      title,
                    });

                    if (res.status === 200) {
                      PopupManager.alert({
                        title: "Erfolgreich",
                        description:
                          "Der Newsletter wurde erfolgreich versendet!",
                      });
                    } else {
                      PopupManager.alert({
                        title: "Fehler",
                        description:
                          "Es ist ein Fehler aufgetreten: " + res.payload.error,
                      });
                    }
                  }}
                >
                  Newsletter versenden
                </Button>
              </Box>
            </Flex>
          </>
        )}
      </AdminLayout>
    </>
  );
}
