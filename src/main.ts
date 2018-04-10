import express from 'express';
import socket from 'socket.io';
import Job from './models/job';
import Queue from './models/queue';
import ReceivedJobMessage from './messages/receivedJobMessage';
import UserStore from './models/userStore';
import User from './models/user';
import { PASSWORD } from './constants';

const app = express();
const server = require('http').Server(app);
const io = socket(server);

server.listen(process.env.PORT || 8000);

const queue = new Queue();
const users = new UserStore();
let inOperation = false;

io.on('connection', (socket) => {
  let loginedUser: User|null = null;

  /* initialize */
  updateStatusHandler();
  updateJobQueueHandler();

  socket.on('Join', (name: string) => {
    const newUser = new User(name, socket.id, false);
    if (users.addUser(newUser)) {
      socket.emit('Joined', newUser);
    }
  });

  socket.on('AdminJoin', (password: string) => {
    if ((process.env.PASSWORD || PASSWORD) !== password) {
      return socket.emit('FailedJoin', 'Incorrect password. Please try agein.');
    }

    const newUser = new User('Admin', socket.id, true);
    if(users.addUser(newUser)) {
      socket.emit('Joined', newUser);
    }

    return;
  });

  socket.on('Job', (job: Job) => {
    if (!inOperation) return;
    if (queue.enqueue(job)) {
      // successful enqueue
      updateJobQueueHandler();
      socket.emit('ReceivedJob', new ReceivedJobMessage(true, job))
    } else {
      socket.emit('ReceivedJob', new ReceivedJobMessage(false, undefined))
    }
  });

  socket.on('cancel', () => {
    if (!loginedUser) return;

    if (queue.cancel(loginedUser)) {
      updateJobQueueHandler();
      socket.emit('Canceled');
    }
  })

  socket.on('Status', (inOpe: boolean) => {
    updateStatusHandler();
    inOperation = inOpe;
  })
});

const updateStatusHandler = () => {
  io.sockets.emit('UpdateStatus', inOperation);
};

const updateJobQueueHandler = () => {
  io.sockets.emit('UpdateJobQueue', queue.queue);
}
