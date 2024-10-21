/**
 * apps/observability/src/components/AppLayout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.10.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";

export default function AppLayout(props: { children: React.ReactNode }) {
  useUserLoggedInRedirect({
    allowAnonymous: true,
    redirectTo: `https://codeup.space/account/auth?appId=6716b5aa9fa93e4dc0283868&redirect=${
      window.location.origin + "/auth"
    }`,
  });
  return <>{props.children}</>;
}
