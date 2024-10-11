/**
 * apps/web/src/global/mantine-components/adminDashboard/ContactCard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.10.2024
 *
 */

import * as React from "react";
import DashboardCard from "./DashboardCard";
import { Button, Text } from "@mantine/core";
import { DASHBOARD_CONTACTS } from "../../../pages/admin-v2/queries";

export default function ContactCard() {
  return (
    <>
      <DashboardCard
        title={"Contact Requests"}
        description={
          "Overview over the contact requests that may have to be answered."
        }
        renderContent={(data) => (
          <>
            <Text>
              <b>{data.ContactCount}</b> contact requests have been received.
              You can view them in the dedicated page.
            </Text>
            <Button
              component={"a"}
              href={"/admin-v2/contacts"}
              fullWidth
              mt={"md"}
            >
              View Contact Requests
            </Button>
          </>
        )}
        gqlQuery={DASHBOARD_CONTACTS}
        customVariables={{}}
      />
    </>
  );
}
