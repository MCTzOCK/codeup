/**
 * apps/web/src/global/cwswrapper.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.12.2024
 *
 */

import * as child_process from "child_process";

function getBaseCommand() {
  return `java -jar ${process.env.CWS_JAR} --mode=client --host=${process.env.CWS_HOST} --port=${process.env.CWS_PORT} --auth=${process.env.CWS_AUTH}`;
}

export async function hasCws(username: string): Promise<boolean> {
  const output = await getProcessOutput(
    `${getBaseCommand()} --commands="has ${username}"`
  );
  return output.trim() === "200 OK";
}

export async function startCws(id: string): Promise<void> {
  await getProcessOutput(`${getBaseCommand()} --commands="start ${id}"`);
}

export async function stopCws(id: string): Promise<void> {
  await getProcessOutput(`${getBaseCommand()} --commands="stop ${id}"`);
}

export async function createCws(username: string): Promise<void> {
  await getProcessOutput(`${getBaseCommand()} --commands="create ${username}"`);
}

export async function getCws(): Promise<string[]> {
  return (await getProcessOutput(`${getBaseCommand()} --commands="ls"`))
    .split("\n")
    .filter((line) => !line.startsWith("200"));
}

export async function getId(username: string): Promise<string | null> {
  const output = await getProcessOutput(`${getBaseCommand()} --commands="ls"`);
  const lines = output.split("\n").filter((line) => !line.startsWith("200"));
  for (const line of lines) {
    if (line.includes(username)) {
      return line.split(" ")[1];
    }
  }
  return null;
}

async function getProcessOutput(command: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    child_process.exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}
