export default class {
  private data: Array<{
    key: string;
    value: any;
  }> = [];

  constructor() {
    const self = this;
    return new Proxy(this, {
      get: (target: any, p: any) => {
        if (typeof target[p] !== "undefined") {
          return target[p];
        }
        return this.getData(p);
      },
      set(
        target: any,
        p: string | number | symbol,
        value: any,
        receiver: any
      ): boolean {
        if (typeof target[p] !== "undefined") {
          return (target[p] = value);
        }
        self.setData(typeof p === "string" ? p : "_object", value);
        return true;
      }
    });
  }
  public clearData(): void {
    this.data = [];
  }
  public getData(key: string): any {
    const entry: { key: string; value: any } | undefined = this.data.find(
      (tmpEntry: { key: string; value: any }) => tmpEntry.key === key
    );
    return entry ? entry.value : undefined;
  }
  public getDataIndex(key: string): number | undefined {
    let result: number | undefined;
    for (let index: number = 0; index < this.data.length; index++) {
      if (this.data[index].key === key) {
        result = index;
        break;
      }
    }
    return result;
  }
  public setData(key: string, value: any) {
    const index: number | undefined = this.getDataIndex(key);
    if (index !== undefined) {
      this.data[index].value = value;
    } else {
      this.data.push({ key, value });
    }
    return this;
  }
}
