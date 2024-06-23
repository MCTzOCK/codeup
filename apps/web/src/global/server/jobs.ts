/**
 * apps/web/src/global/server/jobs.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.06.2024
 *
 */

export class Jobs {
  public static jobs: Job[] = [];

  public static getJobs() {
    return Jobs.jobs;
  }

  public static getID() {
    return Math.random().toString(10);
  }

  public static getJobByID(id: string) {
    return Jobs.jobs.find((j) => j.id === id);
  }

  public static getJobsByNames(name: string) {
    return Jobs.jobs.filter((j) => j.name === name);
  }
}

export enum JobStatus {
  IDLE = 0,
  BUILDING = 1,
  DEPLOYING = 2,
  FINISHED = 3,
  FAILED = 4,
}

export class Job {
  public name: string;
  public id: string;
  public status: JobStatus = JobStatus.IDLE;
  public startedAt: Date;
  public endedAt?: Date;

  constructor(name: string) {
    this.name = name;
    this.id = Jobs.getID();
    this.startedAt = new Date();
    Jobs.jobs.push(this);
  }

  public setStatus(status: JobStatus) {
    this.status = status;
    if (status === JobStatus.FINISHED || status === JobStatus.FAILED) {
      this.endedAt = new Date();
    }
  }

  public getStatus() {
    return this.status;
  }
}
