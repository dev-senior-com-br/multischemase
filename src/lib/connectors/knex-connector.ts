import { IContext } from '../interfaces';
import { AbstractConnector } from './abstract-connector';
import { KnexConnectorBuilder } from '../builders/knex-connector-builder';
import Knex, { MigratorConfig } from 'knex';
import { KnexConfigResolver } from '../resolvers/knex-config-resolver';
import { FileTypeEnum } from '../enums';
import { SQLMigrationSource } from './sql-migration-source';

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
    if (this.config.fileType === FileTypeEnum.KNEX) {
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
