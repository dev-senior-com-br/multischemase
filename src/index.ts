#!/usr/bin/env node

import Multischemase from './lib/multischemase';
import { ClientEnum, FileTypeEnum } from './lib/enums';

const multischemase = new Multischemase({
  client: ClientEnum.PG,
  connection: {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
  },
  directory: './migrates',
  fileRegex: /^\d+([\w-])+\.sql$/,
  fileType: FileTypeEnum.SQL
});

multischemase.setContext('test5', 'test4');

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