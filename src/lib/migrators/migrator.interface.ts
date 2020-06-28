import { Context } from '../configuration';
import { ListInfo } from '.';

export interface Migrator {
  clean(): Promise<void>;
  current(): Promise<string>;
  list(): Promise<ListInfo>;
  migrate(): Promise<void>;
  destroy(): void;
  reload(context: Context): void;
  testConnection(): Promise<void>;
}
