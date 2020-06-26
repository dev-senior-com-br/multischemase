import { IResolver } from '../interfaces/resolver.interface';
import Knex from 'knex';
import { IConfig } from '../interfaces';
export class KnexConfigResolver implements IResolver<Knex.Config, IConfig> {
    resolve(params: IConfig): Knex.Config<any> {
        return {
            connection: {
                host: params.connection.host,
                port: params.connection.port,
                database: params.connection.database,
                password: params.connection.password,
                user: params.connection.user
            },
            client: params.client
        }
    }
}