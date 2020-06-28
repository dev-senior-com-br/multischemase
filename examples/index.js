#!/usr/bin/env node

const { Multischemase } = require('../dist/index');

const multischemase = 
  new Multischemase({ connection: { user: 'postgres', password: 'postgres' }, directory: 'examples/migrations' });
const multischemase2 = new Multischemase('examples/multischemase.json');

multischemase.checkLock();

multischemase.setContext('test5', 'test4');
multischemase2.setContext('test7', 'test4');
multischemase2.migrate().then(()=> console.log('irrá'));
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
  console.log('deu boa6');
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