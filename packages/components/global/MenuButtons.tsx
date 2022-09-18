/**
 * packages/components/global/MenuButtons.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import * as React from "react";
import { Button } from "@chakra-ui/react";
import { useLoggedIn } from "@codeup/hooks";
import Link from "next/link";

export default function MenuButtons(props: {
  onClose: () => void;
  onUserAuthOpen: () => void;
  onLogoutOpen: () => void;
}) {
  const { loggedIn } = useLoggedIn();

  return (
    <>
      {!loggedIn ? (
        <>
          <Button
            variant={"solid"}
            onClick={() => {
              props.onClose();
              props.onUserAuthOpen();
            }}
            colorScheme={"whatsapp"}
          >
            Anmelden
          </Button>
        </>
      ) : (
        <>
          <Link href={"/dashboard"}>
            <Button
              variant={"solid"}
              colorScheme={"blue"}
              onClick={props.onClose}
            >
              Dashboard
            </Button>
          </Link>
          <Button
            variant={"solid"}
            colorScheme={"red"}
            onClick={() => {
              props.onClose();
              props.onLogoutOpen();
            }}
          >
            Abmelden
          </Button>
        </>
      )}
    </>
  );
}
