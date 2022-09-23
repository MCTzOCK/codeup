/**
 * apps/web/src/pages/forum/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.09.2022
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { useEffect } from "react";

export default function Index() {
  const { loggedIn, userInfo } = useLoggedIn();

  useEffect(() => {
    alert(userInfo.sso);
  }, [loggedIn, userInfo]);

  return <></>;
}
