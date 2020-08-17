#!/usr/bin/env node

const Multischemase = require("../dist");

Multischemase.Custom('examples/multischemase.json').then(multischemase => {
  multischemase.setContext('SERVICE', 'TENANT');
  return multischemase.migrate().then(() => {
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
    console.log('migrate realizadeo com sucesso');
    multischemase.setContext('test', 'test', '3');
    return multischemase.migrate();
  }).then(() => {
    console.log('todas migrações realizadas com sucesso');
  }).catch(err => {
    console.error(err);
  }).finally(() => {
    multischemase.destroy();
    process.exit(0);
  });
});

Multischemase.Custom('examples/multischemase.json').then(multischemase => {
  multischemase.setContext('XPTO', 'TEST');
  return multischemase.migrate().then(()=> console.log('migrate realizado com sucesso')).catch(err => console.error(err)).finally(() => multischemase.destroy());
});

Multischemase.Knex('examples/knexfile.js', 'production').then(async multischemase => {
  multischemase.setContext('xessus', 'TEST');
  await multischemase.clean();
  await multischemase.migrate().then(()=> console.log('migrate realizado com sucesso')).catch(err => console.error(err));
  const knex = multischemase.getClient();
  await knex.insert({id: 'b79efee4-b592-49e0-b3d5-1c664a17f48e', name: 'My nombre'}).into('users');
  await knex.insert({id: '65d0b6dc-7515-45ea-87c8-b491859e055d', name: 'My task', assignee: 'b79efee4-b592-49e0-b3d5-1c664a17f48e'}).into('tasks');
  const results = await knex.select().table('tasks');
  console.log(results);
  multischemase.destroy();
  return knex;
}).then(knex => {
  Multischemase.Knex(knex).then(async multischemase => {
    multischemase.setContext('xesssssus', 'TEsssST');
    await multischemase.clean();
    await multischemase.migrate().then(()=> console.log('migrate realizado com sucesso')).catch(err => console.error(err));
    const knex = multischemase.getClient();
    await knex.insert({id: 'b79efee4-b592-49e0-b3d5-1c664a17f48e', name: 'My nombre'}).into('users');
    await knex.insert({id: '65d0b6dc-7515-45ea-87c8-b491859e055d', name: 'My task', assignee: 'b79efee4-b592-49e0-b3d5-1c664a17f48e'}).into('tasks');
    const results = await knex.select().table('tasks');
    console.log(results);
    multischemase.destroy();
  });
});