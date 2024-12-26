import DataHndl from "./handler/Datahandler";
import EventHndl from "./handler/Eventhandler";
import { IHtmlElementExtensions } from "./Interfaces/IHtmlElementExtensions";
import canvas from "./lib/canvas";
import _createStore from "./lib/createStore";
import DialogClass from "./lib/Dialog";
import dom from "./lib/dom";
import CachedDataProviderClass from "./Provider/CachedDataProvider";
import DialogProviderClass  from "./service/DialogProvider";
import ObjectStoreProviderClass from "./service/ObjectStoreProvider";

export default {
  CachedDataProvider: CachedDataProviderClass,
  Datahandler: DataHndl,
  Dialog: DialogClass,
  DialogProvider: DialogProviderClass,
  Eventhandler: EventHndl,
  ObjectStoreProvider: ObjectStoreProviderClass,
  canvasLib: canvas,
  createStore: _createStore,
  domLib: dom
};

export const createStore = _createStore;
export const CachedDataProvider = CachedDataProviderClass;
export const canvasLib = canvas;
export const Datahandler = DataHndl;
export const Dialog = DialogClass;
export const DialogProvider = DialogProviderClass;
export const domLib = dom;
export const Eventhandler = EventHndl;
export const ObjectStoreProvider = ObjectStoreProviderClass;

declare global {
    // tslint:disable-next-line:interface-name no-empty-interface
    interface HTMLElement extends IHtmlElementExtensions {}
}
