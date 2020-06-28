import { ConnectorResolver } from '../resolvers/connector-resolver';
import { Config } from '../interfaces/config.interface';
import { IConnector } from '../interfaces/connector.interface';

export class ConnectorFactory {
  private static instance: ConnectorFactory;
  private constructor() {}
  private resolver: ConnectorResolver = new ConnectorResolver();
  public static getInstance(): ConnectorFactory {
    if (!ConnectorFactory.instance) {
      ConnectorFactory.instance = new ConnectorFactory();
    }
    return ConnectorFactory.instance;
  }

  public getConnector(config: Config): IConnector {
    const { migrationType: fileType, client } = config;
    const builder = this.resolver.resolve({ fileType, client });
    return builder.setConfig(config).build();
  }
}
