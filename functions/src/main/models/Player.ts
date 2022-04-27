import Copyable from "utils/Copyable";

export default class Player extends Copyable<Player> {
  constructor(
    readonly userId: string,
    readonly userName: string,
    readonly iconUrl: string,
    readonly rightToTalk: boolean,
    readonly ready: boolean,
    readonly trump: string,
  ) {
    super();
  }
}
