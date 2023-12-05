import DataHndl from "./handler/Datahandler";
import EventHndl from "./handler/Eventhandler";
import _createStore from "./lib/createStore";
import dom from "./lib/dom";
import ObjectStoreProv from "./service/ObjectStoreProvider";

export default {
  Datahandler: DataHndl,
  Eventhandler: EventHndl,
  ObjectStoreProvider: ObjectStoreProv,
};

export const createStore = _createStore;
export const Datahandler = DataHndl;
export const domLib = dom;
export const Eventhandler = EventHndl;
export const ObjectStoreProvider = ObjectStoreProv;
