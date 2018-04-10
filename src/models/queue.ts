import Job from "./job";
import User from "./user";

export default class Queue {
  queue: Job[]; 
  private lastId: number;

  constructor() {
    this.queue = [];
    this.lastId = 0;
  }

  enqueue(job: Job):boolean {
    if (!job.user) {
      return false;
    }

    if (this.isEnqueuedJobByUser(job.user)) {
      return false;
    } else {
      job.id = (this.lastId += 1)
      this.queue.push(job);
      return true;
    }
  }

  cancel(user: User):boolean {
    let isRemoved = false;
    this.queue = this.queue.filter((job) => {
      if (job.user) {
        if (job.user.socketId !== user.socketId) {
          return true;
        } else {
          isRemoved = true;
          return false;
        }
      } else {
        return true;
      }
    })

    return isRemoved;
  }

  isEnqueuedJobByUser(user: User):boolean {
    return this.queue.filter((job) => {
      if (!job.user) {
        throw Error;
      } else {
        return job.user.socketId === user.socketId;
      }
    }).length > 0;
  }
}