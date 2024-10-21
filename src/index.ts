import DataHndl from "./handler/Datahandler";
import EventHndl from "./handler/Eventhandler";
import canvas from "./lib/canvas";
import _createStore from "./lib/createStore";
import dom from "./lib/dom";
import CachedDataProviderClass from "./Provider/CachedDataProvider";
import ObjectStoreProviderClass from "./service/ObjectStoreProvider";

export default {
  CachedDataProvider: CachedDataProviderClass,
  Datahandler: DataHndl,
  Eventhandler: EventHndl,
  ObjectStoreProvider: ObjectStoreProviderClass,
  canvasLib: canvas,
  createStore: _createStore,
  domLib: dom
};

export const createStore = _createStore;
export const CachedDataProvider = CachedDataProviderClass;
export const Datahandler = DataHndl;
export const canvasLib = canvas;
export const domLib = dom;
export const Eventhandler = EventHndl;
export const ObjectStoreProvider = ObjectStoreProviderClass;
