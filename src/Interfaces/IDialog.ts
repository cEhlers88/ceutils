/**
 * Interface IDialog
 * Created 21.03.22
 *
 * @author Christoph Ehlers <webmaster@c-ehlers.de>
 */
export interface IDialog {
  reset: () => void;
  getAcceptations: () => [];
  getDefaultProviderOptions: () => {
    abortAble: boolean;
  };
  getAdditionalFooterButtons: () => Array<{
    text: string;
    onClick: () => void;
  }>;
  getName: () => string;
  onRendered: (element: HTMLElement) => void;
  render: (props: any) => HTMLElement;
  updateProps: (newProps: any) => void;
  validate: () => {
    hadError: boolean;
    errorMessage: string;
    reOpen: boolean;
  };
}
