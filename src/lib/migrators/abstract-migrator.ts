import { Migrator } from './migrator.interface';
import { Config } from '../configuration/config.interface';
import { ListInfo } from './list-info.interface';
import { Context } from '../configuration/context.interface';

export abstract class AbstractMigrator<T> implements Migrator<T> {
  protected config!: Config;
  constructor(config: Config) {
    this.config = config;
  }
  abstract clean(): Promise<void>;
  abstract current(): Promise<string>;
  abstract list(): Promise<ListInfo>;
  abstract migrate(): Promise<void>;
  abstract reload(context: Context): void;
  public destroy(): void {
    this.onDestroy();
  }
  abstract onDestroy(): void;
  abstract testConnection(): Promise<void>
  abstract getClient(): T;
}
