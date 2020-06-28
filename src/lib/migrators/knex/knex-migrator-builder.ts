import { KnexMigrator } from '.';
import { Config } from '../../configuration';
import { MigratorBuilder } from '..';
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
