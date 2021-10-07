import DataHndl from "./handler/Datahandler";
import EventHndl from "./handler/Eventhandler";
import _createStore from "./lib/createStore";
import dom from "./lib/dom";

export default {
  Datahandler: DataHndl,
  Eventhandler: EventHndl
};

export const createStore = _createStore;
export const Datahandler = DataHndl;
export const Eventhandler = EventHndl;
export const domLib = dom;
