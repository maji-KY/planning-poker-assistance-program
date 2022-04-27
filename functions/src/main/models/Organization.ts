import Copyable from "utils/Copyable";

export default class Organization extends Copyable<Organization> {
  constructor(
    readonly id: string,
    readonly name: string,
  ) {
    super();
  }
}
