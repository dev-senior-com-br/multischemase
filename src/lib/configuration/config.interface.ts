import { MigrationTypeEnum } from './migration-type.enum';
import { ClientEnum } from './client.enum';

export interface Config {
  connection?: {
    host?: string;
    user?: string;
    password?: string;
    port?: number;
    database?: string;
  };
  client: ClientEnum;
  directory: string;
  migrationType: MigrationTypeEnum;
  fileRegex: RegExp;
}

export interface ConfigMultischemase {
  connection?: {
    host?: string;
    user?: string;
    password?: string;
    port?: number;
    database?: string;
  };
  client?: ClientEnum;
  directory?: string;
  migrationType?: MigrationTypeEnum;
  fileRegex?: RegExp;
}

export const ConfigParametersDefaults = {
  client: ClientEnum.PG,
  directory: './migrations',
  migrationType: MigrationTypeEnum.SQL,
  fileRegex: /\d+[\w-]+\.sql$/
};