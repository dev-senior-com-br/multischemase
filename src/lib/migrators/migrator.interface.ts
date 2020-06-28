import { Context } from '../configuration';

export interface Migrator {
  clean(): Promise<void>;
  current(): Promise<string>;
  list(): Promise<string[]>;
  migrate(): Promise<void>;
  destroy(): void;
  reload(context: Context): void;
}
