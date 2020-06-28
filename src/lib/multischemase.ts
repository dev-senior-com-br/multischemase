import { ConfigResolver } from './configuration';
import { ConfigMultischemase, Config } from './configuration';
import { Migrator } from './migrators';
import { MigratorFactory } from './migrators';

export class Multischemase {
  #connectorFactory = MigratorFactory.getInstance();
  #config: Config;
  #connector: Migrator;
  #configResolver = new ConfigResolver();
  #lock = false;
  constructor(configFile: string);
  constructor(config: ConfigMultischemase);
  constructor(conf: string | ConfigMultischemase = 'multischemase.json') {
    this.#config = this.#configResolver.resolve(conf);
    this.#connector = this.#connectorFactory.getConnector(this.#config);
  }
  public migrate(): Promise<void> {
    return this.exec<void>(this.#connector.migrate, this.#connector);
  }
  public clean(): Promise<void> {
    return this.exec<void>(this.#connector.clean, this.#connector);
  }
  public current(): Promise<string> {
    return this.exec<string>(this.#connector.current, this.#connector);
  }
  public list(): Promise<string[]> {
    return this.exec<string[]>(this.#connector.list, this.#connector);
  }
  private exec<T>(action: () => Promise<T>, thiz: Migrator): Promise<T> {
    this.checkLock();
    this.toggleLock();
    return action.call(thiz).finally(() => this.toggleLock());
  }
  public setContext(service: string, tenant: string): void;
  public setContext(context: string, ...complements: string[]): void;
  public setContext(...contexts: string[]): void {
    this.checkLock();
    this.#connector.reload({ schema: contexts.join('_') });
  }
  public destroy(): void {
    this.#connector.destroy();
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
}
