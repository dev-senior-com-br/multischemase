import { Observable, Subscription } from 'rxjs';
import { IContext, IConfig } from '../interfaces';

export abstract class AbstractConnector {
  private contextObs: Observable<IContext>;
  protected config: IConfig;
  private contextSubs: Subscription;
  constructor(config: IConfig, contextObs: Observable<IContext>) {
    this.contextObs = contextObs;
    this.config = config;
    this.contextSubs = this.contextObs.subscribe(this.reload);
  }
  abstract reload(context: IContext):void;
  public destroy() {
    this.contextSubs.unsubscribe();
  }
}
