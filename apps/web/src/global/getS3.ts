/**
 * apps/web/src/global/getS3.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.05.2024
 *
 */

import * as minio from "minio";

export function getS3() {
  return new minio.Client({
    endPoint: process.env.MINIO_ENDPOINT as string,
    useSSL: process.env.MINIO_USE_SSL === "true",
    port: parseInt(process.env.MINIO_PORT as string),
    accessKey: process.env.MINIO_ACCESS_KEY as string,
    secretKey: process.env.MINIO_SECRET_KEY as string,
  });
}
