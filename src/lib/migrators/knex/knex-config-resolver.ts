import { Resolver } from '../../interfaces';
import Knex from 'knex';
import { Config } from '../../configuration';
export class KnexConfigResolver implements Resolver<Knex.Config, Config> {
  resolve(params: Config): Knex.Config {
    const { connection, client } = params;
    return { connection, client };
  }
}
