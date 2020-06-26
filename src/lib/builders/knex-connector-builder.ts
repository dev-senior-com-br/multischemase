import { IConnectorBuilder } from '../interfaces/connector-builder.interface';
import { KnexConnector } from '../connectors/knex-connector';
import { IConfig } from '../interfaces/config.interface';
export class KnexConnectorBuilder implements IConnectorBuilder<KnexConnector> {
  private config!: IConfig;
  setConfig(config: IConfig): IConnectorBuilder<KnexConnector> {
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
