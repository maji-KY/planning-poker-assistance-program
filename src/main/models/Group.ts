import Copyable from "utils/Copyable";

export default class Group extends Copyable<Group> {
  constructor(
    readonly id: string,
    readonly organizationId: string,
    readonly name: string,
    readonly topic: string,
    readonly allReady: boolean,
  ) {
    super();
  }
}
