/**
 * apps/web/src/pages/test-vt-desktop.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.11.2024
 *
 */

import * as React from "react";
import WindowManager from "@codeupspace/vt-desktop/src/windowmanager/WindowManager";
import { IWindow } from "@codeupspace/vt-desktop/src/types/IWindow";
import { IApp } from "@codeupspace/vt-desktop/src/types/IApp";
import Desktop from "@codeupspace/vt-desktop/src/desktop/Desktop";
import TaskBar from "@codeupspace/vt-desktop/src/taskbar/TaskBar";
import { FaBorderAll } from "react-icons/fa6";
import { FaFile } from "react-icons/fa";
import { Box } from "@chakra-ui/react";

export default function TestVirtualDesktop() {
  const [windows, setWindows] = React.useState<IWindow[]>([]);
  const [installedApps, setInstalledApps] = React.useState<IApp[]>([
    {
      name: "CodeUp",
      icon: "https://codeup.space/codeup.png",
      component: <div>CodeUp</div>,
      uuid: Math.random().toString(36).substring(7),
      windows: [],
      flags: {
        "modos.taskbar": true,
        "modos.desktop": true,
      },
      onAppOpen: () => {
        console.log("CodeUp opened");
        setInstalledApps((apps) => {
          return apps.map((app) => {
            if (app.name === "CodeUp") {
              const uuid = Math.random().toString(36).substring(7);

              app.windows.push({
                title: "CodeUp",
                component: <div>{uuid}</div>,
                uuid: uuid,
                icon: "https://codeup.space/codeup.png",
                onClose: () => {
                  console.log("CodeUp closed");
                  removeWindow(app.uuid, uuid);
                },
                closed: false,
                minimzed: false,
                zIndex: 3,
                onResize: () => {},
                onMove: () => {},
                width: 400,
                height: 400,
                maximizable: true,
                onMaximize: () => {},
                onMinimize: () => {
                  minimizeWindow(app.uuid, uuid);
                },
                y: 100,
                x: 100,
                type: "iframe",
                url: "https://codeup.space/codeup/about",
                minimizable: true,
                closable: true,
                maximized: false,
                resizable: true,
              });
            }
            return app;
          });
        });
      },
    },
  ]);

  const removeWindow = (appUUID: string, windowUUID: string) => {
    setInstalledApps((apps) => {
      return apps.map((app) => {
        if (app.uuid === appUUID) {
          app.windows = app.windows.map((window) => {
            if (window.uuid === windowUUID) {
              window.closed = true;
            }
            return window;
          });
        }
        return app;
      });
    });
  };

  const minimizeWindow = (appUUID: string, windowUUID: string) => {
    setInstalledApps((apps) => {
      return apps.map((app) => {
        if (app.uuid === appUUID) {
          app.windows = app.windows.map((window) => {
            if (window.uuid === windowUUID) {
              window.minimzed = true;
            }
            return window;
          });
        }
        return app;
      });
    });
  };

  const [activeWindow, setActiveWindow] = React.useState<string | null>("");

  return (
    <Box h={"100vh"} w={"100vw"} overflow={"hidden"}>
      <Desktop
        backgroundType={"image"}
        backgroundImage={"/_static/images/software-developer-6521720_1920.jpg"}
        items={[
          {
            icon: <FaFile size={48} />,
            label: "Test-App",
            onClick: () => {},
          },
        ]}
        installedApps={installedApps}
      />
      <WindowManager
        background={"transparent"}
        windows={windows}
        setWindows={setWindows}
        preventDefaultTaskbar
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        installedApps={installedApps}
      />
      <TaskBar
        windows={windows}
        setWindows={setWindows}
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        customItems={[
          {
            icon: <FaBorderAll size={42} />,
            onClick: () => {},
            title: "Menu",
          },
        ]}
        applications={installedApps}
      />
    </Box>
  );
}

TestVirtualDesktop.noLayout = true;
