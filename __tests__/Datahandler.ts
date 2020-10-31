import Datahandler from "../src/handler/Datahandler";
let Handler: Datahandler;

beforeEach(() => {
  Handler = new Datahandler();
});

describe("Basics", () => {
  test("getData should return previous setData value", () => {
    Handler.setData("isok?", "isOk!");
    expect(Handler.getData("isok?")).toBe("isOk!");
  });

  test("Test proxy-functionality", () => {
    // @ts-ignore
    Handler.lala = "OK";
    // @ts-ignore
    expect(Handler.lala).toBe("OK");
  });

  test("Return undefined if requested property doesnt exist and no defaultResult is specified", () => {
    expect(Handler.getDataSave("undefinedProperty")).toBe(undefined);
  });

  test("Return defaultResult if requested property doesnt exist", () => {
    expect(Handler.getDataSave("undefinedProperty", "isOk")).toBe("isOk");
  });

  test("Return defined value if defaultResult and requested property is defined", () => {
    // @ts-ignore
    Handler.definedProperty = "isOk";
    expect(Handler.getDataSave("definedProperty", "isNotOk")).toBe("isOk");
  });

  test("Test getData after setMultipleaData", () => {
    Handler.setMultipleData({
      test1: "123",
      test2: "hallo"
    });

    expect(Handler.getData("test1")).toBe("123");
    expect(Handler.getData("test2")).toBe("hallo");
  });

  test("Test getAll result after setMultipleData", () => {
    Handler.setMultipleData({
      test1: "foo",
      test2: "bar"
    });
    expect(Handler.getAll()).toEqual([
      { key: "test1", value: "foo" },
      { key: "test2", value: "bar" }
    ]);
  });

});