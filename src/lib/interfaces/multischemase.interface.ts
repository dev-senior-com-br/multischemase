import { ListInfo } from './list-info.interface';
import Knex from 'knex';

export interface IMultischemase {
    setContext(service: string, tenant: string): void;
    setContext(context: string, ...complements: string[]): void;
    setContext(...contexts: string[]): void;
    testConnection(): Promise<void>;
    getClient(): Knex;
    migrate(): Promise<void>;
    clean(): Promise<void>;
    current(): Promise<string>;
    list(): Promise<ListInfo>;
    destroy(): void;
  }