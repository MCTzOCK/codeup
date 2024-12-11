/**
 * apps/web/src/pages/cloud-pc/attach.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.12.2024
 *
 */

import * as React from "react";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { sProp } from "../../global/i18nstaticProps";
import { useEffect } from "react";
import { useLoggedIn } from "@codeup/hooks";
import { useRouter } from "next/router";
import AccountManager from "@codeup/util/dist/AccountManager";

export default function Attach() {
  const { loggedIn, loaded, userInfo } = useLoggedIn();
  const router = useRouter();

  const [status, setStatus] = React.useState<string>("Connecting...");

  useEffect(() => {
    if (!loaded) return;

    if (!loggedIn) {
      router.push("/error?error=Unauthorized");
    }

    fetch("/api/cloud-computing/attach", {
      method: "GET",
      headers: {
        "X-JWT": AccountManager.getActiveToken(),
      },
    }).then((res) => {
      res.json().then((data) => {
        if (res.status !== 200) {
          router.push("/error?error=" + data.error);
        } else {
          setStatus("Waiting for the cloud computer to start...");
          setTimeout(() => {
            window.location.assign(data.url);
          }, 5000);
        }
      });
    });
  }, [loggedIn, loaded]);

  return (
    <>
      <AuthenticateLoadingIndicator text={status} />
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["user-page"])),
  };
}
