/**
 * Interface IMagicProperties
 * Created 13.12.21
 *
 * @author Christoph Ehlers <ce@construktiv.de> | Construktiv GmbH
 */
export interface IMagicProperties {
  childNodes?: (targetElement: HTMLElement, children: HTMLElement[]) => HTMLElement[];
  innerText?: ((targetElement: HTMLElement, value: string) => void) | string;
  onBlur?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onChange?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onClick?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onFocus?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onKeyDown?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onKeyUp?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onSubmit?: (targetElement: HTMLElement, listener: CallableFunction) => void;
}
