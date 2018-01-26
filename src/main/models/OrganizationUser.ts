import Copyable from "utils/Copyable";

export default class OrganizationUser extends Copyable<OrganizationUser> {
  constructor(
    readonly organizationId: string,
    readonly userId: string,
  ) {
    super();
  }
}
