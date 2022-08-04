/**
 * src/pages/account/logout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import * as React from "react";
import { useEffect } from "react";
import { Spinner } from "@chakra-ui/react";

export default function Logout() {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      document.cookie = "jwt=;path=/";
    }
    window.location.href = "/";
  }, []);

  return (
    <>
      <Spinner />
    </>
  );
}
