import Eventhandler from "../handler/Eventhandler";

const createStore = () => {
  class Store extends Eventhandler {
    public __data: {};

    constructor() {
      super();
      this.__data = {};
    }
  }
  return new Proxy(new Store(), {
    get: (target: any, propertyName: string) => {
      if (propertyName === "on") {
        return target.addListener.bind(target);
      }
      if (propertyName === "getAll") {
        return target.__data;
      }
      if (target.__data[propertyName]) {
        return target.__data[propertyName];
      }
      return undefined;
    },
    set: (target, propertyName, value) => {
      const eventProps: {
        name: any;
        oldValue?: any;
        value: any;
      } = {
        name: propertyName,
        value
      };
      if (target.__data[propertyName]) {
        eventProps.oldValue = target.__data[propertyName];
        target.dispatch("updateStore", eventProps);
        target.dispatch("update_" + eventProps.name, eventProps);
      }
      target.dispatch("set_" + eventProps.name, eventProps);
      target.__data[propertyName] = value;
      return target;
    }
  });
};

export default createStore;
