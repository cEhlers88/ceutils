import {IHtmlElementExtensions} from "./src/Interfaces/IHtmlElementExtensions";


declare global {
    // tslint:disable-next-line:interface-name no-empty-interface
    interface HTMLElement extends IHtmlElementExtensions {}
}

export {};