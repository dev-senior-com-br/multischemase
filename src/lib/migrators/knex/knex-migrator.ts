import { AbstractMigrator } from '../abstract-migrator';
import Knex, { MigratorConfig } from 'knex';
import { KnexConfigResolver } from './knex-config-resolver';
import { Config } from '../../configuration/config.interface';
import { ListInfo } from '../list-info.interface';
import { KnexSQLMigrationSource } from './knex-sql-migration-source';
import { KnexMigratorBuilder } from './knex-migrator-builder';
import { Context } from '../../configuration/context.interface';
import { ConfigTypeEnum } from 'src/lib/configuration/config-type.enum';


export class KnexMigrator extends AbstractMigrator<Knex> {
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
    if(this.config.type === ConfigTypeEnum.Multischemase && this.config.multischemase) {
      migratorConfig.migrationSource = new KnexSQLMigrationSource(
        this.config.multischemase.directory, 
        this.config.multischemase.fileRegex
      );
    }
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
    const knexInstance = Knex({ ...this.knexConfig });
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
