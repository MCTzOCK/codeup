/**
 * apps/web/src/pages/admin/contents/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.10.2022
 *
 */

import * as React from "react";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import AdminContentsLayout from "@codeup/components/admin/AdminContentsLayout";

export default function index() {
  return (
    <>
      <AdminLayout>
        <AdminContentsLayout>123</AdminContentsLayout>
      </AdminLayout>
    </>
  );
}
