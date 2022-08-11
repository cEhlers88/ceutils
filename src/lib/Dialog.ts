/**
 * Library Dialog
 * Created 21.03.22
 *
 * @author Christoph Ehlers <ce@construktiv.de> | Construktiv GmbH
 */
import Eventhandler from "../handler/Eventhandler";
import { IDialog } from "../Interfaces/IDialog";

export default abstract class Dialog extends Eventhandler implements IDialog {
  protected name: string;
  protected props: any;

  constructor() {
    super();
    this.name = "";
  }

  public getAcceptations(): [] {
    return [];
  }

  public getDefaultProviderOptions() {
    return {
      abortAble: false
    };
  }

  public getName() {
    return this.name;
  }

  public validate() {
    return {
      errorMessage: "",
      hadError: false,
      props: this.props,
      reOpen: false
    };
  }

  public doRender(props: any): HTMLElement {
    this.props = props;
    return this.render(props);
  }
  public abstract render(props: any): HTMLElement;
  public abstract reset(): void;
  public abstract onRendered(element: HTMLElement): void;

  public updateProps(newProps: any): void {
    this.dispatch("propsUpdated", { newProps, oldProps: this.props });
  }

  public getAdditionalFooterButtons(): Array<{
    text: string;
    onClick: () => void;
  }> {
    return [];
  }
}
