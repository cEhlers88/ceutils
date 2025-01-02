import {IDrawEngine} from "./src/Interfaces/IDrawEngine";
import {IHtmlElementExtensions} from "./src/Interfaces/IHtmlElementExtensions";

declare global {
    // tslint:disable-next-line:interface-name no-empty-interface
    interface HTMLElement extends IHtmlElementExtensions {}

    // tslint:disable-next-line:interface-name
    interface Window {
        [name: string]: any;
    }
}

export {};