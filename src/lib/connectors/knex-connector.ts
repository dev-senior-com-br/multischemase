import { AbstractConnector } from './abstract-connector';
import { KnexConnectorBuilder } from '../builders/knex-connector-builder';
import Knex, { MigratorConfig } from 'knex';
import { KnexConfigResolver } from '../resolvers/knex-config-resolver';
import { SQLMigrationSource } from './sql-migration-source';
import { MigrationTypeEnum } from '../enums/migration-type.enum';
import { IContext } from '../interfaces/context.interface';

export class KnexConnector extends AbstractConnector {
  private knex!: Knex;
  private knexConfig!: Knex.Config;
  private configResolver = new KnexConfigResolver();
  private schema!: string;

  async clean(): Promise<void> {
    const knexInstance = Knex({ ...this.knexConfig });
    await knexInstance.raw(`DROP SCHEMA IF EXISTS ${this.schema} CASCADE;`);
    knexInstance.destroy();
  }
  current(): Promise<string> {
    return this.knex.migrate.currentVersion(this.getMigratorConfig());
  }
  list(): Promise<string[]> {
    return this.knex.migrate.list(this.getMigratorConfig());
  }
  async migrate(): Promise<void> {
    const knexInstance = Knex({ ...this.knexConfig });
    await knexInstance.raw(`CREATE SCHEMA IF NOT EXISTS ${this.schema};`);
    knexInstance.destroy();
    await this.knex.migrate.latest(this.getMigratorConfig());
  }

  private getMigratorConfig(): MigratorConfig {
    const migratorConfig: MigratorConfig = {};
    if (this.config.migrationType === MigrationTypeEnum.KNEX) {
      migratorConfig.directory = this.config.directory;
    } else {
      migratorConfig.migrationSource =
        new SQLMigrationSource(this.config.directory, this.config.fileRegex);
    }
    return migratorConfig;
  }

  reload(context: IContext): void {
    if (!this.knexConfig) {
      this.knexConfig = this.configResolver.resolve(this.config);
    }
    if(this.knex) this.knex.destroy();
    this.knex = Knex({ ...this.knexConfig, searchPath: context.schema });
    this.schema = context.schema;
  }

  static builder(): KnexConnectorBuilder {
    return new KnexConnectorBuilder();
  }

  onDestroy(): void {
    this.knex.destroy();
  }
}
