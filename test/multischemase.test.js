var Multischemase = require("../dist/index").Multischemase;
var CommandsEnum = require("../dist/index").CommandsEnum;

var service = "service";
var tenant = "teste";
var multischemase = new Multischemase(service, tenant);

let outputData = "";
storeLog = (inputs) => (outputData += inputs);
{
  test("empty config folder", () => {
    console["log"] = jest.fn(storeLog);
    require("../dist/index");

    try {
      var command = CommandsEnum.MIGRATE;
      multischemase.exec(command, "");
      throw new Error("Missing config folder, must throws an error.");
    } catch (err) {}
  });

  test("console undefined config folder", () => {
    //  console["log"] =
    require("../dist/index");
    var command = "";
    try {
      multischemase.exec(command, null);
      throw new Error("Missing config folder, must throws an error.");
    } catch (err) {
      console.log("Error: " + err);
    }
  });

  test("null command", () => {
    //  console["log"] =
    require("../dist/index");
    try {
      var command = null;
      multischemase.exec(command, "");
      throw new Error("Missing null command, must throws an error.");
    } catch (err) {
      console.log("Error: " + err);
    }
  });

  test("empty command", () => {
    //  console["log"] =
    require("../dist/index");
    try {
      var command = "";
      multischemase.exec(command, "");
      throw new Error("Missing empty command, must throws an error.");
    } catch (err) {
      console.log("Error: " + err);
    }
  });

  test("null config file", () => {
    //  console["log"] =
    require("../dist/index");
    try {
      var command = "";
      multischemase.exec(command, "test/conf", null);
      throw new Error("Missing empty command, must throws an error.");
    } catch (err) {
      console.log("Error: " + err);
    }
  });

  test("getSchemaName", () => {
    //  console["log"] =
    require("../dist/index");
    expect(multischemase.getSchemaName()).toBe(service + "_" + tenant);
  });

  
  test("MIGRATE", () => {
    //  console["log"] =
      require("../dist/index");
  
      var command = CommandsEnum.MIGRATE;
      multischemase.exec(command, "test/conf");
    });

  test("BASELINE", () => {
    //  console["log"] =
    require("../dist/index");

    var command = CommandsEnum.BASELINE;
    multischemase.exec(command, "test/conf");
  });

    test("REPAIR", () => {
      //  console["log"] =
      require("../dist/index");

      var command = CommandsEnum.REPAIR;
      multischemase.exec(command, "test/conf");
    });

  test("VALIDATE", () => {
  //  console["log"] =
    require("../dist/index");

    var command = CommandsEnum.VALIDATE;
    multischemase.exec(command, "test/conf");
  });

  test("CLEAN", () => {
    //  console["log"] =
      require("../dist/index");

      var command = CommandsEnum.CLEAN;
      multischemase.exec(command, "test/conf");
    });
}
