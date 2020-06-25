import { Observable, Subscriber } from 'rxjs';
import { IConfig, IContext, IConnector } from './interfaces';
import { ConnectorFactory } from './connectors';

export default class Multischemase {
  private connectorFactory = ConnectorFactory.getInstance();
  private config: IConfig;
  private connector: IConnector;
  private contextSubs!: Subscriber<IContext>;
  private contextObs: Observable<IContext>;
  constructor(config: IConfig) {
    this.contextObs = new Observable(subscriber => {
      this.contextSubs = subscriber;
    });
    this.config = config;
    this.connector = this.connectorFactory.getConnector(
      this.config,
      this.contextObs
    );
  }
  public migrate() {
    return this.connector.migrate();
  }
  public clean() {
    return this.connector.clean();
  }
  public current() {
    return this.connector.current();
  }
  public list() {
    return this.connector.list();
  }
  public setContext(context: IContext) {
    this.contextSubs.next(context);
  }
  public destroy() {
    this.contextSubs.complete();
  }
}
