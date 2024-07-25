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
import { useTranslation } from "next-i18next";

export default function Newsletter() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const { t } = useTranslation(["base", "navbar", "footer"]);

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
          {t("newsletter", { ns: "footer" })}
        </Heading>
        <Text color={"gray.300"} fontSize={"md"}>
          {t("newsletter.text", { ns: "footer" })}
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
                        title: t("newsletter.unsubscribed", { ns: "footer" }),
                        description: t("newsletter.unsubscribed.text", {
                          ns: "footer",
                        }),
                      });
                    } else {
                      await PopupManager.alertAsync({
                        title: t("control.error", { ns: "base" }),
                        description:
                          t("newsletter.unsubscribed.error", { ns: "footer" }) +
                          res.payload.error,
                      });
                    }
                  }}
                >
                  {t("newsletter.unsubscribe", { ns: "footer" })}
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
                        title: t("newsletter.subscribed", { ns: "footer" }),
                        description: t("newsletter.subscribed.text", {
                          ns: "footer",
                        }),
                      });
                    } else {
                      await PopupManager.alertAsync({
                        title: t("control.error", { ns: "base" }),
                        description:
                          t("newsletter.subscribed.error", { ns: "footer" }) +
                          res.payload.error,
                      });
                    }
                  }}
                >
                  {t("newsletter.subscribe", { ns: "footer" })}
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Button
              bg={"brand.500"}
              color={"black"}
              _hover={{
                bg: "brand.500",
                color: "black",
              }}
              _focus={{
                bg: "brand.500",
                color: "black",
              }}
              size={"lg"}
              onClick={() => {
                window.dispatchEvent(new CustomEvent("codeup::open_login"));
              }}
            >
              {t("newsletter.login.to.subscribe", { ns: "footer" })}
            </Button>
          </>
        )}
      </Stack>
    </>
  );
}
