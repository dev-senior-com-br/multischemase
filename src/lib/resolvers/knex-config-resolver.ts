import { IResolver } from '../interfaces/resolver.interface';
import Knex from 'knex';
import { Config } from '../interfaces/config.interface';
export class KnexConfigResolver implements IResolver<Knex.Config, Config> {
  resolve(params: Config): Knex.Config {
    const { connection, client } = params;
    return { connection, client };
  }
}
