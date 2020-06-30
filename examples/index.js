#!/usr/bin/env node

const {Multischemase} = require('../dist/index');

const multischemase = 
  new Multischemase('examples/multischemase.json');
const multischemase2 = 
  new Multischemase('examples/multischemase.json');

multischemase.checkLock();

multischemase.setContext('SERVICE', 'TENANT');
multischemase2.setContext('XPTO', 'TEST');
multischemase2.migrate().then(()=> console.log('irrá')).catch(err => console.error(err));
multischemase.migrate().then(() => {
  return multischemase.list();
}).then(list => {
  console.log(list);
  return multischemase.current();
}).then(current => {
  console.log(current);
  return multischemase.clean();
}).then(() => {
  return multischemase.migrate();
}).then(() => {
  console.log('migrate realizado com sucesso.');
  multischemase.setContext('test', 'test', '2');
  return multischemase.migrate();
}).then(() => {
  console.log('deu boa7');
  multischemase.setContext('test', 'test', '3');
  return multischemase.migrate();
}).then(() => {
  console.log('deu boa tudo');
}).catch(err => {
  console.error(err);
}).finally(() => {
  multischemase.destroy();
  process.exit(0);
});
