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
