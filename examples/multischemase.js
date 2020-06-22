var Multischemase = require("multischemase").Multischemase;
var Context = require("multischemase").Context;
var CommandsEnum = require("multischemase").CommandsEnum;

var service = "service";
var tenant = "teste";
var context = new Context(new Multischemase(service, tenant));

var command = CommandsEnum.MIGRATE;
var configFolder = "../conf";
var configFile = "config.js";
context.exec(command, configFolder, configFile);