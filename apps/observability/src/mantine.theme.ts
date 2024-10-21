/**
 * apps/observability/src/mantine.theme.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.10.2024
 *
 */

import { createTheme, DEFAULT_THEME, mergeMantineTheme } from "@mantine/core";

export const mantineTheme = mergeMantineTheme(
  DEFAULT_THEME,
  createTheme({
    black: "#000",
  })
);
