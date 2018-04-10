import Job from "../models/job";

export default class ReceivedJobMessage {
  constructor(
    public isSuccess: boolean,
    public job?: Job
  ) {}
}