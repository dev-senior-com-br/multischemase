import { ConfigResolver, Logger } from './configuration';
import { ConfigMultischemase, Config } from './configuration';
import { Migrator } from './migrators';
import { MigratorFactory } from './migrators';
import { ListInfo } from './migrators';

export class Multischemase {
  #migratorFactory = MigratorFactory.getInstance();
  #config: Config;
  #migrator: Migrator;
  #configResolver = new ConfigResolver();
  #lock = false;
  #connectionErr!: Error; 
  constructor();
  constructor(configFile: string);
  constructor(config: ConfigMultischemase);
  constructor(conf: string | ConfigMultischemase = 'multischemase.json') {
    this.#config = this.#configResolver.resolve(conf);
    this.#migrator = this.#migratorFactory.getMigrator(this.#config);
    this.#migrator.testConnection().catch(err => this.#connectionErr = err);
  }
  public migrate(): Promise<void> {
    return this.exec<void>(this.#migrator.migrate, this.#migrator);
  }
  public clean(): Promise<void> {
    return this.exec<void>(this.#migrator.clean, this.#migrator);
  }
  public current(): Promise<string> {
    return this.exec<string>(this.#migrator.current, this.#migrator);
  }
  public list(): Promise<ListInfo> {
    return this.exec<ListInfo>(this.#migrator.list, this.#migrator);
  }
  private exec<T>(action: () => Promise<T>, thiz: Migrator): Promise<T> {
    this.checkConnection();
    this.checkLock();
    this.toggleLock();
    return action.call(thiz).finally(() => this.toggleLock());
  }
  public setContext(service: string, tenant: string): void;
  public setContext(context: string, ...complements: string[]): void;
  public setContext(...contexts: string[]): void {
    this.checkLock();
    this.#migrator.reload({ schema: contexts.join('_').toLowerCase() });
  }
  public destroy(): void {
    this.#migrator.destroy();
  }
  private checkLock(): void {
    if(this.#lock) {
      throw new Error(
        'Wait for the last call to finalize. ' +
        'All actions return a promise, ' +
        'wait the action end to call another action or to change context.'
      );
    }
  }
  private toggleLock(): void {
    this.#lock = !this.#lock;
  }
  private checkConnection(): void {
    if(this.#connectionErr) {
      throw new Error('Could not connect to DB: \n' + this.#connectionErr.stack);
    }
  }
}

export { ConfigMultischemase };
export { Logger };