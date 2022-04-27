import Copyable from "utils/Copyable";

export default class GroupUser extends Copyable<GroupUser> {
  constructor(
    readonly groupId: string,
    readonly userId: string,
    readonly rightToTalk: boolean,
    readonly ready: boolean,
    readonly trump: string,
  ) {
    super();
  }
}
