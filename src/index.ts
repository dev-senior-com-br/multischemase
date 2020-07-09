import { Multischemase } from './lib/core/multischemase';
import { ConfigMultischemase } from './lib/interfaces/config.interface';
import { CustomKnexMultischemase } from './lib/knex/custom-knex-multischemase';
import { KnexMultischemase } from './lib/knex/knex-multischemase';
import Knex from 'knex';
import { join } from 'path';

async function CustomCtor(
  configuration: ConfigMultischemase | string = 'multischemase.json'
): Promise<Multischemase> {
  const multischemase = new CustomKnexMultischemase(configuration);
  await multischemase.testConnection();
  return multischemase;
}
async function KnexCtor(
  knex: Knex | Knex.Config | string = 'knexfile.js', 
  env?: string
): Promise<Multischemase> {
  let config = knex;
  if(typeof config === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const knexfile: any = await import(join(process.cwd(), config));
    if(env) {
      config = knexfile[env];
    } else {
      config = knexfile;
    }
    config = (config as Knex.Config);
  }
  const multischemase = new KnexMultischemase(config);
  await multischemase.testConnection();
  return multischemase;
}

export { KnexCtor as Knex };
export { CustomCtor as Custom };
export { Multischemase as Multischemase };