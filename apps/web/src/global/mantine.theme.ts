/**
 * apps/web/src/global/mantine.theme.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.2024
 *
 */
import { createTheme, DEFAULT_THEME, mergeMantineTheme } from "@mantine/core";

export const mantineTheme = mergeMantineTheme(
  DEFAULT_THEME,
  createTheme({
    black: "#000",
    primaryColor: "brand",
    primaryShade: 5,
    colors: {
      brand: [
        "#fffde0",
        "#fef8cc",
        "#fcf19c",
        "#fae968",
        "#f8e23c",
        "#f7de1f",
        "#f7dc0b",
        "#dbc300",
        "#c3ad00",
        "#a89500",
      ],
    },
    components: {
      Button: {
        styles: {
          root: {
            color: "#000",
          },
        },
      },
    },
  })
);
