import { ClientEnum } from './client.enum';
import { MigrationTypeEnum } from './migration-type.enum';
import { Logger } from './logger.type';
import { ConsoleLogger } from './console-logger';

export type MultischemaseConfiguration = ConfigMultischemase | string;

export interface Config {
  connection?: ConnectionConfig;
  client: ClientEnum;
  directory: string;
  migrationType: MigrationTypeEnum;
  fileRegex: RegExp;
  log: Logger;
}

interface ConfigMultischemase {
  connection?: ConnectionConfig;
  client?: ClientEnum;
  directory?: string;
  migrationType?: MigrationTypeEnum;
  fileRegex?: RegExp;
  log?: Logger;
}

interface ConnectionConfig {
  host?: string;
  user?: string;
  password?: string;
  port?: number;
  database?: string;
}

export const ConfigMultischemaseDefaults = {
  client: ClientEnum.PG,
  directory: './migrations',
  migrationType: MigrationTypeEnum.SQL,
  fileRegex: /\d+[\w-]+\.sql$/,
  log: new ConsoleLogger()
};