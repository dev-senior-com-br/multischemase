import { IContext } from './context.interface';
export interface IConnector {
  clean(): Promise<any>;
  current(): Promise<any>;
  list(): Promise<any>;
  migrate(): Promise<any>;
}
