import { MigratorResolver } from './migrator-resolver';
import { Config } from '../configuration/config.interface';
import { Migrator } from '.';

export class MigratorFactory {
  private static instance: MigratorFactory;
  private constructor() {}
  private resolver: MigratorResolver = new MigratorResolver();
  public static getInstance(): MigratorFactory {
    if (!MigratorFactory.instance) {
      MigratorFactory.instance = new MigratorFactory();
    }
    return MigratorFactory.instance;
  }

  public getMigrator(config: Config): Migrator {
    const { migrationType: fileType, client } = config;
    const builder = this.resolver.resolve({ fileType, client });
    return builder.setConfig(config).build();
  }
}
