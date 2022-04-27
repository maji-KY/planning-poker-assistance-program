import Copyable from "utils/Copyable";

export default class User extends Copyable<User> {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly iconUrl: string,
  ) {
    super();
  }
}
