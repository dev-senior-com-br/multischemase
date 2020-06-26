import { IConfig, IConnector } from './interfaces';
import { ConnectorFactory } from './connectors';

export default class Multischemase {
  private connectorFactory = ConnectorFactory.getInstance();
  private config: IConfig;
  private connector: IConnector;
  constructor(config: IConfig) {
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
