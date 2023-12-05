/**
 * Interface IMagicProperties
 * Created 13.12.21
 *
 * @author Christoph Ehlers <ce@construktiv.de> | Construktiv GmbH
 */
export interface IMagicProperties {
  childNodes?: any | ((targetElement: HTMLElement, children: HTMLElement[] | SVGSVGElement[]) => void)
    | HTMLElement[] | SVGSVGElement[];
  innerText?: ((targetElement: HTMLElement, value: string) => void) | string;
  onBlur?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onChange?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onClick?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onFocus?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onKeyDown?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onKeyUp?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onSubmit?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onLoad?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onMouseOver?: (
    targetElement: HTMLElement,
    listener: CallableFunction
  ) => void;
  onMouseDown?: (
    targetElement: HTMLElement,
    listener: CallableFunction
  ) => void;
  onMouseEnter?: (
      targetElement: HTMLElement,
      listener: CallableFunction
  ) => void;
  onMouseLeave?: (
      targetElement: HTMLElement,
      listener: CallableFunction
  ) => void;
  onMouseUp?: (targetElement: HTMLElement, listener: CallableFunction) => void;
}
