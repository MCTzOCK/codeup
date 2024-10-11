/**
 * apps/web/src/global/mantine-components/adminDashboard/DashboardChartCard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.10.2024
 *
 */

import * as React from "react";
import moment from "moment";
import { useQuery } from "@apollo/client";
import {
  ActionIcon,
  Container,
  Group,
  Popover,
  SegmentedControl,
  Text,
  Title,
} from "@mantine/core";
import { FaCalendar } from "react-icons/fa";
import { DatePicker } from "@mantine/dates";

export default function DashboardChartCard(props: {
  title: string;
  description: string;
  renderContent: (data: any) => React.ReactNode;
  renderChart: (data: any) => React.ReactNode;
  gqlQuery: any;
  customVariables: any;
}) {
  const [dates, setDates] = React.useState<[Date | null, Date | null]>([
    moment().subtract(7, "days").toDate(),
    moment().toDate(),
  ]);
  const [selectedTime, setSelectedTime] = React.useState<
    "one-week" | "two-week" | "month" | "half-year" | "year" | "custom"
  >("one-week");

  React.useEffect(() => {
    if (selectedTime !== "custom") {
      switch (selectedTime) {
        case "one-week":
          setDates([moment().subtract(7, "days").toDate(), moment().toDate()]);
          break;
        case "two-week":
          setDates([moment().subtract(14, "days").toDate(), moment().toDate()]);
          break;
        case "month":
          setDates([moment().subtract(1, "month").toDate(), moment().toDate()]);
          break;
        case "half-year":
          setDates([moment().subtract(6, "month").toDate(), moment().toDate()]);
          break;
        case "year":
          setDates([moment().subtract(1, "year").toDate(), moment().toDate()]);
          break;
      }
    }
  }, [selectedTime]);

  const { loading, error, data } = useQuery(props.gqlQuery, {
    variables: {
      startDate: moment(dates[0]).format("YYYY-MM-DD"),
      endDate: moment(dates[1]).format("YYYY-MM-DD"),
      interval: "day",
      ...props.customVariables,
    },
  });

  return (
    <>
      <Container
        p={"md"}
        fluid
        bg={"var(--mantine-color-dark-7)"}
        style={{
          borderRadius: "var(--mantine-radius-md)",
          width: "100%",
          height: "100%",
        }}
      >
        <Group justify={"space-between"}>
          <Title order={3}>{props.title}</Title>
          <Popover position={"bottom"} withArrow shadow={"md"}>
            <Popover.Target>
              <ActionIcon aria-label={"Change Date"} variant={"filled"}>
                <FaCalendar />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown
              maw={"95%"}
              style={{
                overflow: "scroll",
              }}
            >
              <SegmentedControl
                value={selectedTime}
                onChange={(value) => setSelectedTime(value as any)}
                data={[
                  { value: "one-week", label: "1 Week" },
                  { value: "two-week", label: "2 Weeks" },
                  { value: "month", label: "1 Month" },
                  { value: "half-year", label: "6 Months" },
                  { value: "year", label: "1 Year" },
                  { value: "custom", label: "Custom" },
                ]}
              />
              {selectedTime === "custom" && (
                <DatePicker
                  value={dates}
                  onChange={(value) => setDates(value)}
                  type={"range"}
                  mt={"md"}
                />
              )}
            </Popover.Dropdown>
          </Popover>
        </Group>
        <Text size={"sm"} c={"dimmed"}>
          {props.description}
        </Text>
        {loading || !data ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Text>{props.renderContent(data)}</Text>
            {props.renderChart(data)}
          </>
        )}
      </Container>
    </>
  );
}
