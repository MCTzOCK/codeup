/**
 * packages/components/global/Newsletter.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.04.2023
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { subscribed } from "@codeup/rest/dist/api/Newsletter";
import { Button, ButtonGroup, Heading, Stack, Text } from "@chakra-ui/react";
import { FaNewspaper } from "react-icons/fa";
import PopupManager from "@codeup/web/src/global/PopupManager";

export default function Newsletter() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const [subscribed, setSubscribed] = React.useState(false);

  React.useEffect(() => {
    if (loggedIn && loaded) {
      REST.Newsletter.subscribed(AccountManager.getActiveToken()).then(
        (res) => {
          if (res.status === 200) {
            setSubscribed(res.payload.newsletter);
          }
        }
      );
    }
  }, [loggedIn, loaded]);

  if (!loaded) {
    return <></>;
  }

  return (
    <>
      <Stack gap={2}>
        <Heading
          fontWeight={"extrabold"}
          display={"flex"}
          flexDirection={"row"}
          gap={2}
          alignItems={"center"}
        >
          <FaNewspaper />
          Newsletter
        </Heading>
        <Text color={"gray.300"} fontSize={"md"}>
          Erhalte regelmäßig Updates zu CodeUp und den neusten Projekten.
        </Text>
        {loggedIn ? (
          <>
            {subscribed ? (
              <>
                <Button
                  colorScheme={"red"}
                  onClick={async () => {
                    const res = await REST.Newsletter.unsubscribe(
                      AccountManager.getActiveToken()
                    );

                    if (res.status === 200) {
                      setSubscribed(false);
                      await PopupManager.alertAsync({
                        title: "Abgemeldet",
                        description:
                          "Du wurdest erfolgreich vom Newsletter abgemeldet.",
                      });
                    } else {
                      await PopupManager.alertAsync({
                        title: "Fehler",
                        description:
                          "Beim abmelden ist ein Fehler aufgetreten: " +
                          res.payload.error,
                      });
                    }
                  }}
                >
                  Abmelden
                </Button>
              </>
            ) : (
              <>
                <Button
                  colorScheme={"green"}
                  onClick={async () => {
                    const res = await REST.Newsletter.subscribe(
                      AccountManager.getActiveToken()
                    );

                    if (res.status === 200) {
                      setSubscribed(true);
                      await PopupManager.alertAsync({
                        title: "Angemeldet",
                        description:
                          "Du wurdest erfolgreich beim Newsletter angemeldet.",
                      });
                    } else {
                      await PopupManager.alertAsync({
                        title: "Fehler",
                        description:
                          "Beim anmelden ist ein Fehler aufgetreten: " +
                          res.payload.error,
                      });
                    }
                  }}
                >
                  Anmelden
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Button
              bg={"brand"}
              color={"black"}
              _hover={{
                bg: "brand",
                color: "black",
              }}
              _focus={{
                bg: "brand",
                color: "black",
              }}
              size={"lg"}
              onClick={() => {
                window.dispatchEvent(new CustomEvent("codeup::open_login"));
              }}
            >
              Zum Abonieren anmelden
            </Button>
          </>
        )}
      </Stack>
    </>
  );
}
