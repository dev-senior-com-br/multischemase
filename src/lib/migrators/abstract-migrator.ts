import { Config } from '../configuration';
import { Migrator } from '.';
import { Context } from '../configuration';
import { ListInfo } from './list-info.interface';

export abstract class AbstractMigrator implements Migrator {
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
}
