import User from "./user";

export default class UserStore {
  private users: User[];

  constructor() {
    this.users = [];
  }

  addUser(user: User): boolean {
    if (!this.isAlreadyExist(user)) {
      this.users.push(user);
      console.log(this.users);
      return true;
    } else {
      return false;
    }
  }

  removeUser(user: User) {
    this.users = this.users.filter((u: User) => {
      return user.socketId !== u.socketId;
    });
    console.log(this.users);
  }

  getUserBySocketId(socketId: string): User|null {
    const filteredUser = this.users.filter((user) => {
      return user.socketId === socketId;
    });

    if (filteredUser.length < 0 || filteredUser.length > 1) {
      return null;
    } else {
      return filteredUser[0];
    }
  }

  isAlreadyExist(user: User): boolean {
    return this.users.filter((u) => {
      return u.socketId === user.socketId;
    }).length > 0;
  }

  countOfAllUsers(): number {
    return this.users.length;
  }

  countOfNormalUsers(): number {
    return this.users.filter((user) => {
      return !user.isAdmin;
    }).length
  }

  countOfAdminUsers(): number {
    return this.users.filter((user) => {
      return user.isAdmin;
    }).length
  }
}