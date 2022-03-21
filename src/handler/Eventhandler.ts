import IEventListener from "../Interfaces/IEventListener";

export default class {
  public listeners: IEventListener[] = [];// private

  public addListener(eventName: string, listener: CallableFunction) {
    let eventListenerInfo = this.getEventListenerInfo(eventName);

    if (-1 === eventListenerInfo.index) {
      this.listeners.push({ callbacks: [], eventName });
      eventListenerInfo = this.getEventListenerInfo(eventName);
    }

    this.listeners[eventListenerInfo.index].callbacks.push(listener);
  }
  public dispatch(eventName: string, props?: unknown) {
    const self = this;
    const eventListenerInfo = this.getEventListenerInfo(eventName);
    if (-1 !== eventListenerInfo.index) {
      this.listeners[eventListenerInfo.index].callbacks.map(
        (listener: CallableFunction) => {
          try {
            listener(props);
          } catch (e) {
            self.handleError(e);
          }
        }
      );
    } else {
      this.handleError({ message: "Event " + eventName + " not found." });
    }
  }
  public getListeners(eventName: string): CallableFunction[] {
    const eventListenerInfo = this.getEventListenerInfo(eventName);
    return -1 === eventListenerInfo.index
      ? []
      : this.listeners[eventListenerInfo.index].callbacks;
  }
  public removeListeners(eventName: string): void {
    const eventListenerInfo = this.getEventListenerInfo(eventName);
    this.listeners[eventListenerInfo.index].callbacks = [];
  }
  public setErrorHandle(newHandle: (e?: unknown) => void): void {
    this.handleError = newHandle;
  }
  public on(eventName: string, listener: CallableFunction): void {
    const eventListenerInfo = this.getEventListenerInfo(eventName);
    if (-1 === eventListenerInfo.index) {
      this.addListener(eventName, listener);
    } else {
      this.listeners[eventListenerInfo.index].callbacks = [listener];
    }
  }

  public getEventListenerInfo( // private
    eventName: string
  ): { index: number; eventListener: IEventListener | undefined } {
    const result: {
      index: number;
      eventListener: IEventListener | undefined;
    } = {
      eventListener: undefined,
      index: -1
    };

    for (let i = 0; i < this.listeners.length; i++) {
      if (eventName === this.listeners[i].eventName) {
        result.eventListener = this.listeners[i];
        result.index = i;
      }
      break;
    }
    return result;
  }
  public handleError: (e?: unknown) => void = () => {
    return null;
  }; // private
}
