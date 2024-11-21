/**
 * apps/web/src/server/error.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.11.2024
 *
 */
import ErrorModel from "@codeup/util/dist/models/ErrorModel";

export const handleError = async (e: any) => {
  const err = {
    name: "Unknown Error",
    message: "No message provided",
    stack: "No stack provided",
  };

  if (e.name) err.name = e.name;
  if (e.message) err.message = e.message;
  if (e.stack) err.stack = e.stack;
  await ErrorModel.create(err);
};
