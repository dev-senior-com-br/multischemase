import Knex, { Migration } from 'knex';
import fs from 'fs';
import { join, basename, extname } from 'path';

export class KnexSQLMigrationSource implements Knex.MigrationSource<string> {

  private directory: readonly string[];
  private regex?: RegExp;

  constructor(directory: string | readonly string[], regex?: RegExp) {
    if (typeof directory === 'string') {
      this.directory = [directory];
    } else {
      this.directory = directory;
    }
    this.regex = regex;
  }
  getMigration(migration: string): Migration {
    const isSql = extname(migration).includes('sql') ? true : false;
    return {
      up: async knex => {
        if(isSql) {
          return (await import(migration)).up(knex);
        }
        return knex.raw(fs.readFileSync(migration, 'utf-8'));
      },
      down: async knex => {
        if(isSql) {
          return (await import(migration)).down(knex);
        }
        return knex.raw('select 1;')
      }
    };
  }
  getMigrationName(migration: string): string {
    return basename(migration);
  }
  async getMigrations(): Promise<string[]> {
    let migrations: string[] = [];
    for (const directory of this.directory) {
      migrations = migrations.concat((await fs.promises.readdir(directory))
        .filter(f => this.regex ? f.match(this.regex) : true)
        .map(f => join(directory, f)));
    }
    if (migrations.length === 0) {
      throw new Error(
        `No migration files found in directories '${this.directory.map(dir => join(process.cwd(), dir)).join('; ')}'.` +
        this.regex ? `Or no migration files matches the regex: /${this.regex}/` : '');
      }
    return migrations;
  }
}
