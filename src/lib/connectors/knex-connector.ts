import { IConnector, IContext } from '../interfaces';
import { AbstractConnector } from './abstract-connector';
import { KnexConnectorBuilder } from '../builders/knex-connector-builder';
import Knex from "knex";
import { KnexConfigResolver } from '../resolvers/knex-config-resolver';

export class KnexConnector extends AbstractConnector implements IConnector {
  private knexSchema!: Knex;
  private knexConfig!: Knex.Config;
  private configResolver = new KnexConfigResolver();
  private schema!: string;

  clean(): Promise<any> {
    return Promise.resolve();
  }
  current(): Promise<any> {
    return Promise.resolve();
  }
  list(): Promise<any> {
    return Promise.resolve();
  }
  async migrate(): Promise<any> {
    const knexInstance = Knex({ ...this.knexConfig });
    await knexInstance.raw(`CREATE SCHEMA IF NOT EXISTS ${this.schema};`);
    knexInstance.destroy();
    //TODO: this.knexSchema.migrate.latest();
  }

  reload(context: IContext) {
    if (!this.knexConfig) {
      this.knexConfig = this.configResolver.resolve(this.config);
    }
    this.knexSchema = Knex({ ...this.knexConfig, searchPath: context.schema });
    this.schema = context.schema;
  }

  static builder(): KnexConnectorBuilder {
    return new KnexConnectorBuilder();
  }
}
