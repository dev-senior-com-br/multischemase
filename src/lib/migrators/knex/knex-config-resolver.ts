import { Config } from '../../configuration/config.interface';
import Knex from 'knex';
import { Resolver } from '../../interfaces/resolver.interface';
import { ConfigTypeEnum } from 'src/lib/configuration/config-type.enum';

export class KnexConfigResolver implements Resolver<Knex.Config, Config> {
  resolve(params: Config): Knex.Config {
    if(params.type === ConfigTypeEnum.Knexfile && params.knex) {
      return params.knex;
    } else if(params.type === ConfigTypeEnum.Multischemase && params.multischemase) {
      const { connection, client } = params.multischemase;
      return { connection, client };
    }
    throw new Error('Could not resolve knex config');
  }
}
