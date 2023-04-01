/**
 * apps/web/src/pages/admin/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.04.2023
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import Head from "next/head";

export default function Index() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  return (
    <>
      <Head>
        <title>Admin - CodeUp</title>
      </Head>
      <AdminLayout>123</AdminLayout>
    </>
  );
}
