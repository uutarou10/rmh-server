export default class User {
  constructor (
    public name: string,
    public socketId: string,
    public isAdmin: boolean
  ) {}
}