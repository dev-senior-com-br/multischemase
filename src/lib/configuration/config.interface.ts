import { ClientEnum } from './client.enum';
import { MigrationTypeEnum } from './migration-type.enum';
import { Logger } from './logger.type';
import { ConsoleLogger } from './console-logger';
import Knex from 'knex';
import { ConfigTypeEnum } from './config-type.enum';

export interface MultischemaseConfiguration {
  type?: ConfigTypeEnum,
  config?: ConfigMultischemase | Knex.Config
  configFile?: string
}

export interface Config {
  type: ConfigTypeEnum,
  knex?: Knex.Config,
  multischemase?: ConfigMultischemaseNonNullable
}

interface ConfigMultischemaseNonNullable {
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

export const ConfigMultischemaseParametersDefaults = {
  client: ClientEnum.PG,
  directory: './migrations',
  migrationType: MigrationTypeEnum.SQL,
  fileRegex: /\d+[\w-]+\.sql$/,
  log: new ConsoleLogger()
};