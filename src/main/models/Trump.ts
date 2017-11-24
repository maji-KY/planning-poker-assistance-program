import Copyable from "utils/Copyable";

export default class Trump extends Copyable<Trump> {
  constructor(
    readonly groupId: string,
    readonly userId: string,
    readonly trump: string,
  ) {
    super();
  }
}
