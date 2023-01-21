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
import AlertPopupComponent from "./PopupManager/AlertPopupComponent";
import SelectPopupComponent from "./PopupManager/SelectPopupComponent";

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

  public static alert(options: {
    title?: string | undefined;
    description: string;
  }): void {
    ReactDOM.render(
      <>
        <ChakraProvider theme={theme}>
          <AlertPopupComponent
            title={options.title}
            description={options.description}
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

  public static select(options: {
    title: string;
    helperText: string;
    choices: string[];
    callback: (input: string) => void;
  }) {
    ReactDOM.render(
      <>
        <ChakraProvider theme={theme}>
          <SelectPopupComponent
            title={options.title}
            helperText={options.helperText}
            callback={options.callback}
            choices={options.choices}
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

  public static selectAsync(options: {
    title: string;
    helperText: string;
    choices: string[];
  }): Promise<string> {
    return new Promise((resolve) => {
      this.select({
        title: options.title,
        helperText: options.helperText,
        choices: options.choices,
        callback: (input: string) => {
          resolve(input);
        },
      });
    });
  }
}
