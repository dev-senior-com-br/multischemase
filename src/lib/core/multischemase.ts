import { ListInfo } from '../interfaces/list-info.interface';
import { Context } from '../interfaces/context.interface';
import Knex from 'knex';
import { IMultischemase } from '../interfaces/multischemase.interface';

export abstract class Multischemase implements IMultischemase {
  constructor(){}
  private lock = false;
  private destroyed = false;
  public abstract testConnection(): Promise<void>;
  public abstract getClient(): Knex;
  public migrate(): Promise<void> { return this.exec<void>(this.onMigrate); }
  public clean(): Promise<void> { return this.exec<void>(this.onClean); }
  public current(): Promise<string> { return this.exec<string>(this.onCurrent); }
  public list(): Promise<ListInfo> { return this.exec<ListInfo>(this.onList); }
  protected abstract onMigrate(): Promise<void>;
  protected abstract onClean(): Promise<void>;
  protected abstract onList(): Promise<ListInfo>;
  protected abstract onCurrent(): Promise<string>;
  private exec<M>(action: () => Promise<M>): Promise<M> {
    if(this.destroyed) {
      throw new Error(
        'Multischemase already destroyed connection and objects.' +
        'Call `setContext` or create new Multischemase instance.'
      );
    }
    this.checkLock();
    this.toggleLock();
    return action.call(this).finally(() => this.toggleLock());
  }
  public destroy(): void {
    this.onDestroy();
    this.destroyed = true;
  }
  protected abstract onDestroy(): void;
  private checkLock(): void {
    if (this.lock) {
      throw new Error(
        'Wait for the last call to finalize. ' +
        'All actions return a promise, ' +
        'wait the action end to call another action or to change context.'
      );
    }
  }
  private toggleLock(): void {
    this.lock = !this.lock;
  }
  public setContext(service: string, tenant: string): void;
  public setContext(context: string, ...complements: string[]): void;
  public setContext(...contexts: string[]): void {
    this.checkLock();
    this.destroyed = false;
    this.onContextChange(this.normalizeContext({ schema: contexts.join('_') }));
  }
  protected normalizeContext({ schema }: Context): Context {
    return { schema: schema.toLowerCase() };
  }
  protected abstract onContextChange(context: Context): void;
}