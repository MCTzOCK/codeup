/**
 * apps/web/src/global/PopupManager.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.01.2023
 *
 */
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom";
import PromptPopupComponent from "./PopupManager/PromptPopupComponent";
import theme from "./theme";
import ConfirmPopupComponent from "./PopupManager/ConfirmPopupComponent";

export default class PopupManager {
  public static prompt(options: {
    title: string;
    helperText: string;
    callback: (input: string) => void;
  }): void {
    ReactDOM.render(
      <>
        <ChakraProvider theme={theme}>
          <PromptPopupComponent
            title={options.title}
            helperText={options.helperText}
            callback={options.callback}
            onClose={() => {
              ReactDOM.unmountComponentAtNode(
                document.querySelector(
                  "#__codeup_manual_mount_point"
                ) as HTMLElement
              );
            }}
          />
        </ChakraProvider>
      </>,
      document.querySelector("#__codeup_manual_mount_point") as HTMLElement
    );
  }

  public static confirm(options: {
    title: string;
    question: string;
    approve: () => void;
    deny: () => void;
  }): void {
    ReactDOM.render(
      <>
        <ChakraProvider theme={theme}>
          <ConfirmPopupComponent
            title={options.title}
            question={options.question}
            onClose={() => {
              ReactDOM.unmountComponentAtNode(
                document.querySelector(
                  "#__codeup_manual_mount_point"
                ) as HTMLElement
              );
            }}
            approve={options.approve}
            deny={options.deny}
          />
        </ChakraProvider>
      </>,
      document.querySelector("#__codeup_manual_mount_point") as HTMLElement
    );
  }

  public static promptAsync(options: {
    title: string;
    helperText: string;
  }): Promise<string> {
    return new Promise((resolve) => {
      this.prompt({
        title: options.title,
        helperText: options.helperText,
        callback: (input: string) => {
          resolve(input);
        },
      });
    });
  }

  public static confirmAsync(options: {
    title: string;
    question: string;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirm({
        title: options.title,
        question: options.question,
        approve: () => {
          resolve(true);
        },
        deny: () => {
          resolve(false);
        },
      });
    });
  }
}
