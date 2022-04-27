// https://qiita.com/nwtgck/items/bbfd6e3ca16857eb9c34
export default class Copyable<T> {

  copy(partial: Partial<T>): T {
    const constructor: any = this.constructor;
    const cloneObj: T = new constructor();
    return Object.assign(cloneObj, this, partial);
  }

}
