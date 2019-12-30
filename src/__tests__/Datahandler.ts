import Datahandler from "../Datahandler";

test("Basictest", () => {
  const curDatahandler = new Datahandler();

  curDatahandler.setData("isok?", "isOk!");

  expect(curDatahandler.getData("isok?")).toBe("isOk!");
});

test("Proxytest", () => {
  const curDatahandler = new Datahandler();
  // @ts-ignore
  curDatahandler.lala = "OK";

  // @ts-ignore
  expect(curDatahandler.lala).toBe("OK");
});

test("Return defaultResult if requested property doesnt exist", () => {
  const curDatahandler = new Datahandler();
  expect(curDatahandler.getDataSave("undefinedProperty", "isOk")).toBe("isOk");
});

test("Return defined value if defaultResult and requested property is defined", () => {
  const curDatahandler = new Datahandler();
  // @ts-ignore
  curDatahandler.definedProperty = "isOk";
  expect(curDatahandler.getDataSave("definedProperty", "isNotOk")).toBe("isOk");
});

test("Test set multiple data",()=>{
  const curDatahandler = new Datahandler();

  curDatahandler.setMultipleData({
    test1:'123',
    test2:'hallo'
  });

  expect(curDatahandler.getData('test1')).toBe('123');
  expect(curDatahandler.getData('test2')).toBe('hallo');
})