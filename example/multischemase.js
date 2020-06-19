var Multischemase = require("multischemase").Multischemase;
var CommandsEnum = require("multischemase").CommandsEnum;

var service = "service";
var tenant = "teste";
var multischemase = new Multischemase(service, tenant);

var command = CommandsEnum.MIGRATE;
var configFolder = "conf";
multischemase.exec(command, configFolder);