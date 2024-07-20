/**
 * apps/web/src/special-components/Tracker.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.07.2024
 *
 */

import * as React from "react";
import * as rrweb from "rrweb";
import { useEffect } from "react";
import { useLoggedIn } from "@codeup/hooks";
import AccountManager from "@codeup/util/dist/AccountManager";
import REST from "@codeup/rest/dist";

let events: any[] = [];

export default function Tracker(props: { children: React.ReactNode }) {
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const [sessionID, setSessionID] = React.useState<string | null>(null);

  useEffect(() => {
    if (!loaded) return;
    reloadSID();
  }, [loggedIn, loaded]);

  const reloadSID = async () => {
    const res = await REST.Account.getSessionID(
      AccountManager.getActiveToken() || undefined
    );

    if (res.status !== 200) {
      return;
    }

    setSessionID(res.payload.session);
    console.debug("Session ID", res.payload.session);
    localStorage.setItem("sessionID", res.payload.session);
  };

  const save = async () => {
    console.debug(
      "Attempting to save events with sid",
      localStorage.getItem("sessionID")
    );
    if (!localStorage.getItem("sessionID")) return;
    const res = await REST.Account.postSession({
      token: AccountManager.getActiveToken() || undefined,
      events,
      session: localStorage.getItem("sessionID") as string,
    });
    console.debug("Saved events", res);
  };

  useEffect(() => {
    const i = setInterval(() => {
      save();
    }, 5000);

    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    rrweb.record({
      emit(event) {
        events.push(event);
      },
    });
  }, []);

  return <>{props.children}</>;
}
