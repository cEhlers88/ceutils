export default class {
  private listeners: any = {};

  public addListener(eventName: string, listener: CallableFunction) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName]=[];
    }
    this.listeners[eventName].push(listener);
  }

  public dispatch(eventName: string, props?:unknown) {
    const self = this;
    if (this.listeners[eventName]) {
      this.listeners[eventName].map((listener: CallableFunction) => {
        try {
          listener(props);
        } catch (e) {
          self.handleError(e);
        }
      });
    }
  }
  public setErrorHandle(newHandle: (e?: unknown) => void): void {
    this.handleError = newHandle;
  }
  public on(eventName: string, listener: CallableFunction): void {
    this.listeners[eventName] = [listener];
  }

  private handleError: (e?: unknown) => void = () => {
    return null;
  };
}
