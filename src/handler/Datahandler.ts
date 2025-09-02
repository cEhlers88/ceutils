import { IDataEntry } from "../Interfaces";
import Eventhandler from "./Eventhandler";

export default class Datahandler extends Eventhandler {
  public static KEY_ALL: string = "_all";
  private data: IDataEntry[] = [];
  private _addCurrentlyMultipleData: boolean = false;
  constructor() {
    super();
    const self = this;
    return new Proxy(this, {
      get: (target: any, p: any) => {
        if (typeof target[p] !== "undefined") {
          return target[p];
        }
        return this.getData(p);
      },
      set(target: any, p: string | number | symbol, value: any): boolean {
        if (typeof target[p] !== "undefined") {
          return (target[p] = value);
        }
        self.setData(typeof p === "string" ? p : "_object", value);
        return true;
      }
    });
  }
  public clearData(): void {
    this.dispatch("dataChanged", {
      key: Datahandler.KEY_ALL,
      value: null,
      oldValue: null
    });
    this.data = [];
  }
  public getAll(): IDataEntry[] {
    return this.data;
  }
  public getData(key: string): any {
    const entry: { key: string; value: any } | undefined = this.data.find(
      (tmpEntry: { key: string; value: any }) => tmpEntry.key === key
    );
    return entry ? entry.value : undefined;
  }
  public getDataSave(key: string, defaultResult?: any): any {
    const entryIndex: number | undefined = this.getDataIndex(key);
    if (entryIndex === undefined) {
      return defaultResult;
    } else {
      return this.data[entryIndex].value;
    }
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
  public removeData(key: string) {
    const index: number | undefined = this.getDataIndex(key);
    if (index !== undefined) {
      const oldValue = this.data[index].value;
      this.data.splice(index, 1);
      this.dispatch("dataChanged", { key, value: undefined, oldValue });
    }
    return this;
  }
  public setData(key: string, value: any) {
    const index: number | undefined = this.getDataIndex(key);
    if (index !== undefined) {
      const oldValue = this.data[index].value;
      this.data[index].value = value;
      if (value !== oldValue) {
        this.dispatch("dataChanged", { key, value, oldValue });
      }
    } else {
      this.data.push({ key, value });
      this.dispatch("dataChanged", { key, value, oldValue: null });
    }
    this.dispatch("set_" + key, value);

    return this;
  }
  public setMultipleData(data: any) {
    const eventProps: Array<{ key: string; value: any }> = [];
    for (const name of Object.keys(data)) {
      this.setData(name, data[name]);
      eventProps.push({ key: name, value: data[name] });
    }
    this.dispatch("dataChanged", eventProps);
  }
}
