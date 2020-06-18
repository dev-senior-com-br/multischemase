var Multischemase = require("../dist/index").Multischemase;
var CommandsEnum = require("../dist/index").CommandsEnum;

var service = "service";
var tenant = "teste";
var multischemase = new Multischemase(service, tenant);

var command = CommandsEnum.MIGRATE;
var configFolder = "conf";
multischemase.exec(command, configFolder);