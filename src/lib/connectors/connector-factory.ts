import { IConnector, IConfig, IContext } from '../interfaces';
import { Observable } from 'rxjs';
import { ConnectorResolver } from '../resolvers/connector-resolver';

export class ConnectorFactory {
  private static instance: ConnectorFactory;
  private constructor() { }
  private resolver: ConnectorResolver = new ConnectorResolver();
  public static getInstance(): ConnectorFactory {
    if (!ConnectorFactory.instance) {
      ConnectorFactory.instance = new ConnectorFactory();
    }
    return ConnectorFactory.instance;
  }

  public getConnector(
    config: IConfig,
    contextObs: Observable<IContext>
  ): IConnector {
    const { fileType, client } = config;
    const builder = this.resolver.resolve({ fileType, client });
    return builder.setConfig(config).setContextObs(contextObs).build();
  }
}
