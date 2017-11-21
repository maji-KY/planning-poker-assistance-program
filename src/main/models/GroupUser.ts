import Copyable from "utils/Copyable";

export default class Group extends Copyable<Group> {
  constructor(
    readonly groupId: string,
    readonly userId: string,
    readonly trump: string,
  ) {
    super();
  }
}
