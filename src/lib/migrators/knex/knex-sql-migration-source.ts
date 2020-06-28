import Knex, { Migration } from 'knex';
import fs from 'fs';
import { join, basename } from 'path';

export class KnexSQLMigrationSource implements Knex.MigrationSource<string> {

  private directory: string;
  private regex: RegExp;

  constructor(directory: string, regex: RegExp){
    this.directory = directory;
    this.regex = regex;
  }
  getMigration(migration: string): Migration {
    return {
      up: knex => {
        return knex.raw(fs.readFileSync(migration,'utf-8'));
      },
      down: knex => knex.raw('select 1;'),
    };
  }
  getMigrationName(migration: string): string {
    return basename(migration);
  }
  async getMigrations(): Promise<string[]> {
    return (await fs.promises.readdir(this.directory))
      .filter(f => f.match(this.regex))
      .map(f => join(this.directory, f));
  }
}
