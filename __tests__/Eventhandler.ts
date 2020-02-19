import Eventhandler from "../src/handler/Eventhandler";
let Handler: Eventhandler;

beforeEach(() => {
  Handler = new Eventhandler();
});

describe("Basics", () => {
  test("There should be no any-listener", () => {
    expect(Handler.getListeners("any").length).toBe(0);
  });
  test("There should be one any-listener after add one", () => {
    Handler.addListener("any", () => {});
    expect(Handler.getListeners("any").length).toBe(1);
  });
  test("There should be one any-listener after specify one directly", () => {
    Handler.on("any", () => {});
    expect(Handler.getListeners("any").length).toBe(1);
  });
  test("There should be one any-listener after specify multiple directly", () => {
    Handler.on("any", () => {});
    Handler.on("any", () => {});
    expect(Handler.getListeners("any").length).toBe(1);
  });
  test("", () => {
    Handler.addListener("any", () => {});
    expect(Handler.getListeners("anyElse").length).toBe(0);
  });
  test("", () => {
    Handler.addListener("any", () => {});
    Handler.addListener("any", () => {});
    expect(Handler.getListeners("any").length).toBe(2);
  });
  test("", () => {
    Handler.addListener("any", () => {});
    Handler.addListener("any", () => {});
    Handler.on("any", () => {});
    expect(Handler.getListeners("any").length).toBe(1);
  });
  test("", () => {
    Handler.addListener("any", () => {});
    Handler.removeListeners("any");
    expect(Handler.getListeners("any").length).toBe(0);
  });
  test("", () => {
    Handler.addListener("any", () => {});
    Handler.removeListeners("any");
    Handler.addListener("any", () => {});
    expect(Handler.getListeners("any").length).toBe(1);
  });
});
describe("Advanced", () => {
  test("", () => {
    const fn = jest.fn();
    Handler.setErrorHandle(fn);
    Handler.dispatch("any", { foo: "bar" });
    expect(fn).toBeCalledTimes(1);
  });
  test("", () => {
    const fn = jest.fn();
    Handler.on("any", fn);
    Handler.dispatch("any");
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test("", () => {
    const fn = jest.fn();
    Handler.on("any", fn);
    Handler.on("any", fn);
    Handler.dispatch("any");
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test("", () => {
    const fn = jest.fn();
    Handler.on("any", fn);
    Handler.dispatch("any");
    Handler.dispatch("any");
    expect(fn).toHaveBeenCalledTimes(2);
  });
  test("", () => {
    const fn = jest.fn();
    Handler.addListener("any", fn);
    Handler.dispatch("any");
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test("", () => {
    const fn = jest.fn();
    Handler.addListener("any", fn);
    Handler.addListener("any", fn);
    Handler.addListener("any", fn);
    Handler.dispatch("any");
    expect(fn).toHaveBeenCalledTimes(3);
  });
  test("", () => {
    const fn = jest.fn();
    Handler.addListener("any", fn);
    Handler.dispatch("any", { foo: "bar" });
    expect(fn).toBeCalledWith({ foo: "bar" });
  });
});
