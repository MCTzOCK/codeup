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
import { sProp } from "../../global/i18nstaticProps";
import { Button, Container, SimpleGrid, Text, Title } from "@mantine/core";
import AdminLayout from "../../global/mantine-components/AdminLayout";
import {
  DASHBOARD_ANALYTICS,
  DASHBOARD_CONTACTS,
  DASHBOARD_ERRORS,
  DASHBOARD_FORUM,
  DASHBOARD_PROJECTS,
} from "./queries";
import { AreaChart, BarChart, LineChart, RadarChart } from "@mantine/charts";
import UserCard from "../../global/mantine-components/adminDashboard/UserCard";
import DashboardChartCard from "../../global/mantine-components/adminDashboard/DashboardChartCard";
import DashboardCard from "../../global/mantine-components/adminDashboard/DashboardCard";
import ReachCard from "../../global/mantine-components/adminDashboard/ReachCard";
import ProjectsCard from "../../global/mantine-components/adminDashboard/ProjectsCard";
import ErrorsCard from "../../global/mantine-components/adminDashboard/ErrorsCard";
import ForumCard from "../../global/mantine-components/adminDashboard/ForumCard";
import ContactCard from "../../global/mantine-components/adminDashboard/ContactCard";
import PlanningCard from "../../global/mantine-components/adminDashboard/PlanningCard";

export default function Index() {
  return (
    <>
      <AdminLayout>
        <Container p={"lg"} fluid>
          <Title order={2}>Dashboard Overview</Title>
        </Container>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
          mb={"md"}
          p={"md"}
        >
          <UserCard />
          <ReachCard />
          <ErrorsCard />
          <ProjectsCard />
          <ForumCard />
          <PlanningCard />
          <ContactCard />
        </SimpleGrid>
      </AdminLayout>
    </>
  );
}

Index.noLayout = true;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["admin-v2"])),
  };
}
