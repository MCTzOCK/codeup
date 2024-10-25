/**
 * apps/observability/src/components/CardWithChart.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.10.2024
 *
 */

import * as React from "react";
import moment from "moment";
import { useQuery } from "@apollo/client";
import {
  ActionIcon,
  Box,
  Container,
  Flex,
  Group,
  Menu,
  Popover,
  SegmentedControl,
  Text,
  Title,
} from "@mantine/core";
import { FaCalendar } from "react-icons/fa";
import { DatePicker } from "@mantine/dates";
import {
  FaFileCsv,
  FaFileExcel,
  FaFileExport,
  FaFileImage,
  FaImage,
} from "react-icons/fa6";
import { useId } from "@mantine/hooks";

export default function CardWithChart(props: {
  title: string;
  description: string;
  renderContent: (data: any) => React.ReactNode;
  renderChart: (data: any) => React.ReactNode;
  gqlQuery: any;
  customVariables: any;
  noDate?: boolean;
  style?: any;
  defaultSelectedTime?:
    | "one-week"
    | "two-week"
    | "month"
    | "half-year"
    | "year";
}) {
  const [dates, setDates] = React.useState<[Date | null, Date | null]>([
    moment().subtract(7, "days").toDate(),
    moment().toDate(),
  ]);
  const [selectedTime, setSelectedTime] = React.useState<
    "one-week" | "two-week" | "month" | "half-year" | "year" | "custom"
  >(props.defaultSelectedTime ? props.defaultSelectedTime : "one-week");

  const id = useId();

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

  const exportChart = (format: string, extension: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    ctx!.font = "30px Arial";
    ctx!.fillText(props.title, 10, 35);
    const svg = document.querySelector(
      `#${id} .recharts-responsive-container .recharts-wrapper svg`
    ) as HTMLElement;
    let svgData = new XMLSerializer().serializeToString(svg);
    let style = document.createElement("style");
    for (let i = 0; i < document.styleSheets.length; i++) {
      let x = "";
      for (let j = 0; j < document.styleSheets.item(i)!.cssRules.length; j++) {
        x += document.styleSheets.item(i)?.cssRules[j].cssText;
      }
      style.innerHTML += x;
    }
    style.innerHTML = `* {color: #000000 !important;} :root { --chart-grid-color: #000000 !important; } ${style.innerHTML}`;
    svgData = svgData.replace(
      /<title\/>/g,
      new XMLSerializer().serializeToString(style)
    );
    const img = new Image();

    img.onload = () => {
      img.width = canvas.width;
      img.height = canvas.height;
      ctx?.drawImage(img, 0, 0);
      const a = document.createElement("a");
      a.download = "chart." + extension;
      a.href = canvas.toDataURL(format);
      a.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <>
      <Container
        p={"md"}
        fluid
        bg={"var(--mantine-color-dark-9)"}
        style={{
          borderRadius: "var(--mantine-radius-md)",
          width: "100%",
          height: "100%",
          ...props.style,
        }}
      >
        <Group justify={"space-between"}>
          <Title order={3}>{props.title}</Title>
          <Flex
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            gap={"sm"}
          >
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon aria-label={"More Options"}>
                  <FaFileExport />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Export</Menu.Label>
                <Menu.Item
                  leftSection={<FaFileImage />}
                  onClick={() => {
                    exportChart("image/png", "png");
                  }}
                >
                  PNG
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Popover position={"bottom"} withArrow shadow={"md"}>
              <Popover.Target>
                <ActionIcon
                  aria-label={"Change Date"}
                  variant={"filled"}
                  display={props.noDate ? "none" : "initial"}
                >
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
          </Flex>
        </Group>
        <Text size={"sm"} c={"dimmed"}>
          {props.description}
        </Text>
        {loading || !data ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Text>{props.renderContent(data)}</Text>
            <div id={id}>{props.renderChart(data)}</div>
          </>
        )}
      </Container>
    </>
  );
}
