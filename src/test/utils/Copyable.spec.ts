import {} from "jasmine";
import Copyable from "utils/Copyable";

class Stub extends Copyable<Stub> {
  constructor(readonly a: string, readonly b: number) {
    super();
  }
}

describe("要素の一部がコピーできる", () => {

  it("要素の一部を変更できること", () => {
    const a = new Stub("foo", 1);
    const b = a.copy({"a": "bar"});
    expect(b.a).toBe("bar");
  });

  it("元のオブジェクトは変更されていないこと", () => {
    const a = new Stub("foo", 1);
    a.copy({"a": "bar"});
    expect(a.a).toBe("foo");
  });

});
