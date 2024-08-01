/**
 * apps/game/src/ui/UIManager.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import Layout from "./Layout";

export class UIManager {
  public static root: ReactDOM.Root;

  public static init() {
    this.createRoot();
  }

  public static render(c: React.ReactElement) {
    this.root.render(
      <>
        <Layout>{c}</Layout>
      </>
    );
    document.getElementById("react").style.display = "initial";
    document.body.style.cursor = null;
  }

  public static renderFN(c: React.FC) {
    this.root.render(<Layout>{c({})}</Layout>);
    document.getElementById("react").style.display = "initial";
    document.body.style.cursor = null;
  }

  public static unmount() {
    this.root.unmount();
    this.createRoot();
  }

  public static createRoot() {
    this.root = ReactDOM.createRoot(document.getElementById("react"));
    document.getElementById("react").style.display = "none";
  }
}
