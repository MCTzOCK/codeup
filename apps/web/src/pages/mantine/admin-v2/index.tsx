/**
 * apps/web/src/pages/admin-v2/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.2024
 *
 */

import * as React from "react";
import { sProp } from "../../../global/i18nstaticProps";
import { Button } from "@mantine/core";
import AdminLayout from "../../../global/mantine-components/AdminLayout";

export default function Index() {
  return (
    <>
      <AdminLayout>
        <Button>Hello World</Button>
      </AdminLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["admin-v2"])),
  };
}
