import { MigratorBuilder } from '../migrator-builder.interface';
import { KnexMigrator } from './knex-migrator';
import { Config } from '../../configuration/config.interface';

export class KnexMigratorBuilder 
implements MigratorBuilder<KnexMigrator> {
  private config!: Config;
  setConfig(config: Config): MigratorBuilder<KnexMigrator> {
    this.config = config;
    return this;
  }
  build(): KnexMigrator {
    if (this.config === null) {
      throw new Error('Config cannot be null');
    }
    return new KnexMigrator(this.config);
  }
}
