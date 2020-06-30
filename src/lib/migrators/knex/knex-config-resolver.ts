import { Config } from '../../configuration/config.interface';
import Knex from 'knex';
import { Resolver } from '../../interfaces/resolver.interface';

export class KnexConfigResolver implements Resolver<Knex.Config, Config> {
  resolve(params: Config): Knex.Config {
    const { connection, client } = params;
    return { connection, client };
  }
}
