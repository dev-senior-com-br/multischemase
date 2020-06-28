import { AbstractMigrator } from '..';
import { KnexMigratorBuilder } from '.';
import Knex, { MigratorConfig } from 'knex';
import { KnexConfigResolver } from '.';
import { KnexSQLMigrationSource } from '.';
import { Context, Config } from '../../configuration';
import { ListInfo } from '../list-info.interface';

export class KnexMigrator extends AbstractMigrator {
  private knex!: Knex;
  private knexConfig!: Knex.Config;
  private configResolver = new KnexConfigResolver();
  private schema!: string;

  constructor(config: Config) {
    super(config);
    this.knexConfig = this.configResolver.resolve(this.config);
  }

  async clean(): Promise<void> {
    const knexInstance = Knex({ ...this.knexConfig });
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
    const knexInstance = Knex({ ...this.knexConfig });
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
    //TODO: Knex files compatibility
    // if (this.config.migrationType === MigrationTypeEnum.KNEX) {
    //   migratorConfig.directory = this.config.directory;
    // } else {
    migratorConfig.migrationSource = new KnexSQLMigrationSource(
      this.config.directory, 
      this.config.fileRegex
    );
    // }
    return migratorConfig;
  }

  reload(context: Context): void {
    if(this.knex) this.knex.destroy();
    this.knex = Knex({ ...this.knexConfig, searchPath: context.schema });
    this.schema = context.schema;
  }

  static builder(): KnexMigratorBuilder {
    return new KnexMigratorBuilder();
  }

  onDestroy(): void {
    this.knex.destroy();
  }

  async testConnection(): Promise<void> {
    const knexInstance = Knex({ ...this.knexConfig, acquireConnectionTimeout: 30 });
    try {
      await knexInstance.raw('SELECT 1');
    } finally {
      knexInstance.destroy();
    }
  }
}
