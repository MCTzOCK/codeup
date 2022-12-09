/**
 * @codeup/hooks/hooks/useAnalytics.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.11.2022
 *
 */
import { useEffect, useState } from "react";
import REST from "@codeup/rest/dist";
import { useRouter } from "next/router";

export default function useAnalytics() {
  const router = useRouter();

  let lastPath = "";

  useEffect(() => {
    if (lastPath !== router.pathname) {
      REST.Analytics.postAnalytics({
        token: localStorage.getItem("token") as string,
      });
      lastPath = router.pathname;
    }
  }, [router.pathname]);
}
