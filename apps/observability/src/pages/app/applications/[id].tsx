/**
 * apps/observability/src/pages/app/applications/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.10.2024
 *
 */

import * as React from "react";
import { useRouter } from "next/router";

export default function Application() {
  const router = useRouter();

  return <>App: {router.query.id}</>;
}
