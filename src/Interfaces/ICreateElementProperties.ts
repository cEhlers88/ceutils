/**
 * Interface ICreateElementProperties
 * Created 13.12.21
 *
 * @author Christoph Ehlers <ce@construktiv.de> | Construktiv GmbH
 */

export interface ICreateElementProperties {
    alt?: string,
    class?: string,
    href?: string,
    id?: string,
    src?: string,
    rel?: string,
    childNodes?:HTMLElement[],
    innerText?:string,
    onClick?:CallableFunction,
    onKeyDown?:CallableFunction,
    onKeyUp?:CallableFunction,
    onSubmit?:CallableFunction,
    [name:string]:any
}
