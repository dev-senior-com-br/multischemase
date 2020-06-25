import { IConnector, IContext } from '../interfaces';
import { AbstractConnector } from './abstract-connector';

export class KnexConnector extends AbstractConnector implements IConnector {
  clean(): Promise<any> {
    return Promise.resolve();
  }
  current(): Promise<any> {
    return Promise.resolve();
  }
  list(): Promise<any> {
    return Promise.resolve();
  }
  migrate(): Promise<any> {
    return Promise.resolve();
  }

  reload(context: IContext) {}
}
