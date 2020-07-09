import Knex, { MigratorConfig } from 'knex';
import { KnexMigrationSource } from './knex-migration-source';
import { Context } from '../../interfaces/context.interface';
import { ListInfo } from 'src/lib/interfaces/list-info.interface';
import { basename } from 'path';


export class KnexMigrator {
  private knex!: Knex;
  private config!: Knex.Config;
  private schema!: string;
  private fileRegex!: RegExp;

  constructor(config: Knex.Config) {
    this.config = config;
  }

  public setFileRegex(fileRegex: RegExp): void { this.fileRegex = fileRegex; }

  async clean(): Promise<void> {
    const knexInstance = Knex({ ...this.config });
    await knexInstance.raw(`DROP SCHEMA IF EXISTS ${this.schema} CASCADE;`);
    knexInstance.destroy();
  }

  async current(): Promise<string> {
    let curr = await this.knex.migrate.currentVersion(this.getMigratorConfig());
    if(curr) {
      curr = basename(curr);
    }
    return curr;
  }

  async list(): Promise<ListInfo> {
    const list = await this.knex.migrate.list(this.getMigratorConfig());
    const listInfo: ListInfo = {
      migrated: list[0].map((m:string) => basename(m)),
      pending: list[1].map((m:string) => basename(m))
    };
    return listInfo;
  }
  
  async migrate(): Promise<void> {
    const knexInstance = Knex({ ...this.config });
    try {
      await knexInstance.raw(`CREATE SCHEMA IF NOT EXISTS ${this.schema};`);  
    } finally {
      knexInstance.destroy();
    }
    await this.knex.migrate.latest(this.getMigratorConfig());
  }

  private getMigratorConfig(): MigratorConfig {
    const migratorConfig: MigratorConfig = {};
    migratorConfig.schemaName = this.schema;
    if(this.config.migrations?.directory) {
      migratorConfig.migrationSource = new KnexMigrationSource(this.config.migrations.directory, this.fileRegex);
    }
    return migratorConfig;
  }

  reload(context: Context): void {
    if(this.knex) this.knex.destroy();
    this.knex = Knex({ ...this.config, searchPath: context.schema });
    this.schema = context.schema;
  }

  destroy(): void {
    this.knex.destroy();
  }

  async testConnection(): Promise<void> {
    const knexInstance = Knex({ ...this.config });
    try {
      await knexInstance.raw('SELECT 1');
    } finally {
      knexInstance.destroy();
    }
  }
  getClient():Knex {
    return this.knex;
  }
}
