import { Config } from '../configuration';
import { Migrator } from '.';
import { Context } from '../configuration';

export abstract class AbstractMigrator implements Migrator {
  protected config!: Config;
  constructor(config: Config) {
    this.config = config;
  }
  abstract clean(): Promise<void>;
  abstract current(): Promise<string>;
  abstract list(): Promise<string[]>;
  abstract migrate(): Promise<void>;
  abstract reload(context: Context): void;
  public destroy(): void {
    this.onDestroy();
  }
  abstract onDestroy(): void;
}
