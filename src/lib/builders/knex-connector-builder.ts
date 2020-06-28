import { IConnectorBuilder } from '../interfaces/connector-builder.interface';
import { KnexConnector } from '../connectors/knex-connector';
import { Config } from '../interfaces/config.interface';
export class KnexConnectorBuilder implements IConnectorBuilder<KnexConnector> {
  private config!: Config;
  setConfig(config: Config): IConnectorBuilder<KnexConnector> {
    this.config = config;
    return this;
  }
  build(): KnexConnector {
    if (this.config === null) {
      throw new Error('Config cannot be null');
    }
    return new KnexConnector(this.config);
  }
}
