/**
 * apps/web/src/global/PopupManager.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.01.2023
 *
 */
import {
  ChakraProvider,
  FormControl,
  FormHelperText,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import ReactDOM from "react-dom";
import PromptPopupComponent from "./PopupManager/PromptPopupComponent";
import theme from "./theme";
import ConfirmPopupComponent from "./PopupManager/ConfirmPopupComponent";
import AlertPopupComponent from "./PopupManager/AlertPopupComponent";
import SelectPopupComponent from "./PopupManager/SelectPopupComponent";
import * as React from "react";
import { ReactNode } from "react";
import { FaFile } from "react-icons/fa";

export default class PopupManager {
  public static prompt(options: {
    title: string;
    helperText: string;
    callback: (input: string) => void;
    inputType?: "INPUT" | "TEXTAREA";
  }): void {
    ReactDOM.render(
      <>
        <ChakraProvider theme={theme}>
          <PromptPopupComponent
            title={options.title}
            helperText={options.helperText}
            callback={options.callback}
            inputType={options.inputType || "INPUT"}
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
    description: string | ReactNode;
    callback?: () => void;
    customSize?: string;
  }): void {
    ReactDOM.render(
      <>
        <ChakraProvider theme={theme}>
          <AlertPopupComponent
            customSize={options.customSize}
            title={options.title}
            description={options.description}
            onClose={() => {
              ReactDOM.unmountComponentAtNode(
                document.querySelector(
                  "#__codeup_manual_mount_point"
                ) as HTMLElement
              );
              if (options.callback) options.callback();
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

  public static uploadFile(options: {
    title: string;
    helperText: string;
    callback: (input: FileList) => void;
  }): void {
    ReactDOM.render(
      <>
        <ChakraProvider theme={theme}>
          <AlertPopupComponent
            title={options.title}
            description={
              <>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement>
                      <FaFile />
                    </InputLeftElement>
                    <Input
                      type="file"
                      onChange={(e) => {
                        options.callback(e.target.files as FileList);
                        ReactDOM.unmountComponentAtNode(
                          document.querySelector(
                            "#__codeup_manual_mount_point"
                          ) as HTMLElement
                        );
                      }}
                    />
                  </InputGroup>
                  <FormHelperText>{options.helperText}</FormHelperText>
                </FormControl>
              </>
            }
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
    inputType?: "INPUT" | "TEXTAREA";
  }): Promise<string> {
    return new Promise((resolve) => {
      this.prompt({
        title: options.title,
        helperText: options.helperText,
        inputType: options.inputType || "INPUT",
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

  public static alertAsync(options: {
    title?: string;
    description: string | ReactNode;
    customSize?: string;
  }): Promise<void> {
    return new Promise((resolve) => {
      this.alert({
        title: options.title,
        description: options.description,
        customSize: options.customSize,
        callback: () => {
          resolve();
        },
      });
    });
  }

  public static uploadFileAsync(options: {
    title: string;
    helperText: string;
  }): Promise<FileList> {
    return new Promise((resolve) => {
      this.uploadFile({
        title: options.title,
        helperText: options.helperText,
        callback: (input: FileList) => {
          resolve(input);
        },
      });
    });
  }

  public static removeCurrentPopup(): void {
    ReactDOM.unmountComponentAtNode(
      document.querySelector("#__codeup_manual_mount_point") as HTMLElement
    );
  }
}
