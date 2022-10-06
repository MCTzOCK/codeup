/**
 * apps/web/src/pages/admin/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.10.22
 *
 */
import { useLoggedIn } from "@codeup/hooks";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const { loggedIn, userInfo, loaded: userLoaded } = useLoggedIn();

  const router = useRouter();

  useEffect(() => {
    if (!userLoaded) return;

    if (!loggedIn) {
      router.push(
        "/error?error=Du bist nicht dazu berechtigt diese Seite zu sehen!"
      );
      return;
    }

    if (!userInfo.admin) {
      router.push(
        "/error?error=Du bist nicht dazu berechtigt diese Seite zu sehen!"
      );
    }
  }, [loggedIn, userInfo, userLoaded]);

  return (
    <>
      <div>
        UserInfo:
        <pre>{JSON.stringify(userInfo, null, 2)}</pre>
        <br />
        Loaded: {userLoaded ? "true" : "false"}
      </div>
    </>
  );
}
