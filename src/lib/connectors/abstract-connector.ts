import { Config } from '../interfaces/config.interface';
import { IConnector } from '../interfaces/connector.interface';
import { IContext } from '../interfaces/context.interface';

export abstract class AbstractConnector implements IConnector {
  protected config!: Config;
  constructor(config: Config) {
    this.config = config;
  }
  abstract clean(): Promise<void>;
  abstract current(): Promise<string>;
  abstract list(): Promise<string[]>;
  abstract migrate(): Promise<void>;
  abstract reload(context: IContext): void;
  public destroy(): void {
    this.onDestroy();
  }
  abstract onDestroy(): void;
}
