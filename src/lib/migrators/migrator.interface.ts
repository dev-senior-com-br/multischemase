import { ListInfo } from './list-info.interface';
import { Context } from 'vm';

export interface Migrator<T> {
  clean(): Promise<void>;
  current(): Promise<string>;
  list(): Promise<ListInfo>;
  migrate(): Promise<void>;
  destroy(): void;
  reload(context: Context): void;
  testConnection(): Promise<void>;
  getClient(): T;
}
