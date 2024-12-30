import {IDrawEngine} from "./src/Interfaces/IDrawEngine";
import {IHtmlElementExtensions} from "./src/Interfaces/IHtmlElementExtensions";

declare global {
    // tslint:disable-next-line:interface-name no-empty-interface
    interface HTMLElement extends IHtmlElementExtensions {}

    // tslint:disable-next-line:interface-name
    interface Window {
        __CE_CANVAS_DRAW_2D_ENGINE__?: IDrawEngine;
    }
}

export {};