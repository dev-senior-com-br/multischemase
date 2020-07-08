import Knex, { MigratorConfig } from 'knex';
import { KnexSQLMigrationSource } from './knex-sql-migration-source';
import { Context } from '../../configuration/context.interface';
import { ListInfo } from 'src/lib/interfaces/list-info.interface';


export class KnexMigrator {
  private knex!: Knex;
  private config!: Knex.Config;
  private schema!: string;
  private sql: boolean;

  constructor(config: Knex.Config, sql = true) {
    this.config = config;
    this.sql = sql;
  }

  async clean(): Promise<void> {
    const knexInstance = Knex({ ...this.config });
    await knexInstance.raw(`DROP SCHEMA IF EXISTS ${this.schema} CASCADE;`);
    knexInstance.destroy();
  }

  current(): Promise<string> {
    return this.knex.migrate.currentVersion(this.getMigratorConfig());
  }

  async list(): Promise<ListInfo> {
    const list = await this.knex.migrate.list(this.getMigratorConfig());
    const listInfo: ListInfo = {
      migrated: list[0],
      pending: list[1]
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
      const regex = this.sql ? /\d+[\w-]+\.sql$/ : undefined;
      migratorConfig.migrationSource = new KnexSQLMigrationSource(this.config.migrations.directory, regex);
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
