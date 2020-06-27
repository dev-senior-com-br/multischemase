import { IConfig, IConnector } from './interfaces';
import { ConnectorFactory } from './connectors';
import { ConfigResolver } from './resolvers/config-resolver';

export default class Multischemase {
  private connectorFactory = ConnectorFactory.getInstance();
  private config: IConfig;
  private connector: IConnector;
  private configResolver = new ConfigResolver();
  constructor(configFile: string);
  constructor(config: IConfig);
  constructor(conf: string | IConfig) {
    let config: IConfig;
    if(typeof conf === 'string') {
      config = this.configResolver.resolve(conf);
    } else {
      config = conf as IConfig;
    }
    this.config = config;
    this.connector = this.connectorFactory.getConnector(this.config);
  }
  public migrate(): Promise<void> {
    return this.connector.migrate();
  }
  public clean(): Promise<void> {
    return this.connector.clean();
  }
  public current(): Promise<string> {
    return this.connector.current();
  }
  public list(): Promise<string[]> {
    return this.connector.list();
  }
  public setContext(service: string, tenant: string): void;
  public setContext(context: string, ...complements: string[]): void;
  public setContext(...contexts: string[]): void {
    this.connector.reload({ schema: contexts.join('_') });
  }
  public destroy(): void {
    this.connector.destroy();
  }
}
