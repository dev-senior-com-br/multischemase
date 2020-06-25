import { IConnector, IConfig, IContext } from '../interfaces';
import { Observable } from 'rxjs';
import { ConnectorResolver } from './connector-resolver';

export class ConnectorFactory {
  private static instance: ConnectorFactory;
  private constructor() {}
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
    const clazz = ConnectorResolver.resolve(config.fileType, config.client);
    return new clazz(config, contextObs);
  }
}
