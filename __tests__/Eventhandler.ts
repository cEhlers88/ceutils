import Eventhandler from "../src/handler/Eventhandler";
import fn = jest.fn;
let Handler: Eventhandler;

beforeEach(() => {
  Handler = new Eventhandler();
});

describe("Basics", () => {
  test("There should be no any-listener", () => {
    expect(Handler.getListeners("any").length).toBe(0);
  });
  test("There should be one any-listener after add one", () => {
    Handler.addListener("any", fn());
    expect(Handler.getListeners("any").length).toBe(1);
  });
  test("There should be one any-listener after specify one directly", () => {
    Handler.on("any", fn());
    expect(Handler.getListeners("any").length).toBe(1);
  });
  test("There should be one any-listener after specify multiple directly", () => {
    Handler.on("any", fn());
    Handler.on("any", fn());
    expect(Handler.getListeners("any").length).toBe(1);
  });
  test("When added an 'any' listener, then there should be no 'anyElse' listener", () => {
    Handler.addListener("any", fn());
    expect(Handler.getListeners("anyElse").length).toBe(0);
  });
  test("When added two 'any' listeners, then there should be 2 'any' listeners", () => {
    Handler.addListener("any", fn());
    Handler.addListener("any", fn());
    expect(Handler.getListeners("any").length).toBe(2);
  });
  test("After adding two 'any' listener and one 'any' listener directly, there should be 1 'any' listener", () => {
    Handler.addListener("any", fn());
    Handler.addListener("any", fn());
    Handler.on("any", fn());
    expect(Handler.getListeners("any").length).toBe(1);
  });
  test("After adding 1 'any' listener and removing 'any' ", () => {
    Handler.addListener("any", fn());
    Handler.removeListeners("any");
    expect(Handler.getListeners("any").length).toBe(0);
  });
  test("After adding 1 'any' listener, removing 1 'any' listener and adding 1 'any' listener again there should be 1 'any' listener", () => {
    Handler.addListener("any", fn());
    Handler.removeListeners("any");
    Handler.addListener("any", fn());
    expect(Handler.getListeners("any").length).toBe(1);
  });
});
describe("Advanced", () => {
  test('Calling an unknown eventlistener should dispatch internal errorHandler', () => {
    const fnInt = jest.fn();

    Handler.setErrorHandle(fnInt);
    Handler.dispatch("any", { foo: "bar" });

    expect(fnInt).toBeCalledWith({message:'Event any not found.'});
  });
  test("After define 'any' listener directly and dispatch the 'any' event, the 'any' listener should be called once", () => {
    const fnInt = jest.fn();
    Handler.on("any", fnInt);
    Handler.dispatch("any");
    expect(fnInt).toHaveBeenCalledTimes(1);
  });
  test("", () => {
    const fnInt = jest.fn();
    Handler.on("any", fnInt);
    Handler.on("any", fnInt);
    Handler.dispatch("any");
    expect(fnInt).toHaveBeenCalledTimes(1);
  });
  test("", () => {
    const fnInt = jest.fn();
    Handler.on("any", fnInt);
    Handler.dispatch("any");
    Handler.dispatch("any");
    expect(fnInt).toHaveBeenCalledTimes(2);
  });
  test("", () => {
    const fnInt = jest.fn();
    Handler.addListener("any", fnInt);
    Handler.dispatch("any");
    expect(fnInt).toHaveBeenCalledTimes(1);
  });
  test("", () => {
    const fnInt = jest.fn();
    Handler.addListener("any", fnInt);
    Handler.addListener("any", fnInt);
    Handler.addListener("any", fnInt);
    Handler.dispatch("any");
    expect(fnInt).toHaveBeenCalledTimes(3);
  });
  test("", () => {
    const fnInt = jest.fn();
    Handler.addListener("any", fnInt);
    Handler.dispatch("any", { foo: "bar" });
    expect(fnInt).toBeCalledWith({ foo: "bar" });
  });
});
