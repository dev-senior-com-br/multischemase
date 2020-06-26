import { IContext } from './context.interface';

export interface IConnector {
  clean(): Promise<void>;
  current(): Promise<string>;
  list(): Promise<string[]>;
  migrate(): Promise<void>;
  destroy(): void;
  reload(context: IContext): void;
}
