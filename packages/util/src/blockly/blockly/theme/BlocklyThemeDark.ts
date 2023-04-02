/**
 * Original by Google: https://github.com/google/blockly-sampes/blob/master/plugins/theme-dark/src/index.js
 */

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Dark theme.
 */

import * as Blockly from "blockly/core";

// Temporarily required to ensure there's no conflict with
// Blockly.Themes.Dark
Blockly.registry.unregister("theme", "dark");

/**
 * Dark theme.
 */
export default Blockly.Theme.defineTheme("dark", {
  componentStyles: {
    workspaceBackgroundColour: "#1e1e1e",
    toolboxBackgroundColour: "blackBackground",
    toolboxForegroundColour: "#fff",
    flyoutBackgroundColour: "#252526",
    flyoutForegroundColour: "#ccc",
    flyoutOpacity: 1,
    scrollbarColour: "#797979",
    insertionMarkerColour: "#fff",
    insertionMarkerOpacity: 0.3,
    scrollbarOpacity: 0.4,
    cursorColour: "#d0d0d0",
    // @ts-ignore
    blackBackground: "#333",
  },
});
