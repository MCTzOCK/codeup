/**
 * apps/web/src/server/init.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.11.2024
 *
 */
import Docker from "dockerode";
import mongoose from "mongoose";
import { handleError } from "./error";
import Logger from "./logger";

export const init = async (docker: Docker) => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI as string);
    } catch (e: any) {
      Logger.error("Could not connect to MongoDB", Logger.MONGO);
      Logger.error(e, Logger.MONGO);
      process.exit(1);
    }
  }

  docker
    .pull("mctzock/codeup-serverless-runtime")
    .then((stream) => {
      docker.modem.followProgress(stream, (err: any, res: any) => {
        if (err) {
          Logger.error("Could not pull Docker image", Logger.DOCKER);
          Logger.error(err, Logger.DOCKER);
        } else {
          Logger.info("Pulled Docker image", Logger.DOCKER);
        }
      });
    })
    .catch(async (e) => {
      await handleError(e);
    });
};
