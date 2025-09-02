/**
 * Interface IMagicProperties
 * Created 13.12.21
 *
 * @author Christoph Ehlers <webmaster@c-ehlers.de>
 */
export interface IMagicProperties {
  childNodes?:
    | any
    | ((
        targetElement: HTMLElement,
        children: HTMLElement[] | SVGSVGElement[]
      ) => void)
    | HTMLElement[]
    | SVGSVGElement[];
  innerText?: ((targetElement: HTMLElement, value: string) => void) | string;
  data?:
    | ((targetElement: HTMLElement, value: { [name: string]: string }) => void)
    | { [name: string]: string };
  onBlur?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onChange?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onClick?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onDragStart?: (
    targetElement: HTMLElement,
    listener: CallableFunction
  ) => void;
  onDragEnd?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onDragOver?: (targetElement: HTMLElement, listener: CallableFunction) => void;
  onDragEnter?: (
    targetElement: HTMLElement,
    listener: CallableFunction
  ) => void;
  onDragLeave?: (
    targetElement: HTMLElement,
    listener: CallableFunction
  ) => void;
  onDrop?: (targetElement: HTMLElement, listener: CallableFunction) => void;
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
  onMouseMove?: (
    targetElement: HTMLElement,
    listener: CallableFunction
  ) => void;
  onMouseOut?: (targetElement: HTMLElement, listener: CallableFunction) => void;
}
