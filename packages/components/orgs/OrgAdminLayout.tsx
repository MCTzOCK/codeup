/**
 * packages/components/orgs/OrgAdminLayout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.03.23
 *
 */
import React, { ReactNode, useState } from "react";
import { useLoggedIn } from "@codeup/hooks";
import { useRouter } from "next/router";
import REST from "@codeup/rest";
import AccountManager from "@codeup/util/dist/AccountManager";
import AuthenticateLoadingIndicator from "../admin/AuthenticateLoadingIndicator";

export default function OrgAdminLayout(props: {
  children: ReactNode;
  orgName: string;
}) {
  const { userInfo, loggedIn, loaded } = useLoggedIn();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!router || !router.query || !router.query.name) return;
    if (loaded && !loggedIn) {
      router.push("/#login");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    } else {
      REST.Orgs.getOrg({
        token: AccountManager.getActiveToken(),
        name: router.query.name as string,
      }).then((r) => {
        if (r.status === 200) {
          setLoading(false);
        } else {
          router.push("/error?error=Organisation konnte nicht gefunden werden");
        }
      });
    }
  }, [loaded, loggedIn, router]);

  return (
    <>{loading ? <AuthenticateLoadingIndicator /> : <>{props.children}</>}</>
  );
}
