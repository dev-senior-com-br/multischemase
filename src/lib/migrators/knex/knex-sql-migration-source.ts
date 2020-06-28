import Knex, { Migration } from 'knex';
import fs from 'fs';
import { join } from 'path';

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
        return knex.raw(fs.readFileSync(join(this.directory, migration),'utf-8'));
      },
      down: knex => knex.raw('select 1;'),
    };
  }
  getMigrationName(migration: string): string {
    return migration;
  }
  async getMigrations(): Promise<string[]> {
    const migrations = (await fs.promises.readdir(this.directory))
      .filter(f => f.match(this.regex));
    if(migrations.length === 0) {
      throw new Error(
        `No migration files found in directory ${join(process.cwd(), this.directory)}.` +
        `Or no migration files mamatches the regex: /${this.regex}/`
      );
    }
    return migrations;
  }
}
