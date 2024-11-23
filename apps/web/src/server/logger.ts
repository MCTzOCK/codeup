/**
 * apps/web/src/server/logger.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.11.2024
 *
 */

export default class Logger {
  public static WEB = "WEB";
  public static GIT = "GIT";
  public static SOCKET = "SOC";
  public static DOCKER = "DOC";
  public static MONGO = "MON";

  public static log(message: string, service: string) {
    console.log(`[${service}] ${message} - ${new Date().toISOString()}`);
  }

  public static error(message: string, service: string) {
    console.error(`[${service}] ${message} - ${new Date().toISOString()}`);
  }

  public static info(message: string, service: string) {
    console.info(`[${service}] ${message} - ${new Date().toISOString()}`);
  }
}
