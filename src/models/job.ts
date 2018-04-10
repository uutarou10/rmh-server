import User from "./user";
import { JobType } from "./jobType";

export default class Job {
  constructor (
    public jobType: JobType,
    public id?: number,
    public workId?: number,
    public comment?: string,
    public user?: User
  ) {}
}