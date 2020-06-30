import fs, { readFileSync } from 'fs';
import { join, basename } from 'path';
import Knex, { MigrationSource } from 'knex';

export const CONTEXT_1 = { get: (): string => 'service_tenant1' };
export const CONTEXT_2 = { get: (): string => 'service_tenant2' };
export const CONTEXT_3 = { get: (): string => 'service_tenant3' };
export const MULTISCHEMASE_JSON = { 
  get: (): string => 'test/multischemase.json' 
};
export const TEST_MIGRATION_SOURCE = { 
  get: (migrations = 1): MigrationSource<string> => {
    return {
      getMigration: (migration: string) => {
        return {
          up: (knex: Knex) => knex.raw(readFileSync(join('test/migrations', migration),'utf-8')),
          down: (knex: Knex) => knex.raw('select 1;')
        };
      },
      getMigrationName: (migration: string) => migration,
      getMigrations: async () => {
        return (await fs.promises.readdir('test/migrations'))
          .slice(0, migrations);
      }
    };
  } 
};
export const TABLE_FILMS = { get: (): string => 'films' };
export const TABLE_DISTRIBUTORS = { get: (): string => 'distributors' };
export const RAW_QUERY_EXISTS = { 
  get: (context: string, table: string): string => {
    return `SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE  schemaname = '${context}'
        AND    tablename  = '${table}'
        );`;
  } 
};