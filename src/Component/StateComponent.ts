export default abstract class StateComponent {
  private _node: HTMLElement | undefined;
  private _state: any;
  public getTagName(): string {
    return "div";
  }
  public get state(): any {
    return this._state;
  }
  public setState(state: any): Promise<any> {
    return new Promise(
      (resolve: (newState: any, oldState: any) => any, reject: any) => {
        try {
          const oldState = { ...this._state };
          this._state = state;
          this.rerender();
          resolve(this._state, oldState);
        } catch (e) {
          reject(e);
        }
      }
    );
  }
  public get node(): HTMLElement {
    if (!this._node) {
      this._node = document.createElement(this.getTagName());
    }
    this.rerender();
    return this._node;
  }
  public abstract render(state: any): HTMLElement | HTMLElement[];
  private rerender() {
    this._node!.removeAllChilds();
    const rendered = this.render(this.state);
    if (rendered instanceof HTMLElement) {
      this._node!.appendChild(rendered);
    } else {
      this._node!.appendChilds(rendered);
    }
  }
}
