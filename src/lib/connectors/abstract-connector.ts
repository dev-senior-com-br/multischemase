import { Observable, Subscription } from 'rxjs';
import { IContext, IConfig, IConnector } from '../interfaces';

export abstract class AbstractConnector implements IConnector {
  protected config!: IConfig;
  constructor(config: IConfig) {
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
