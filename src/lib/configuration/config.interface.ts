import { ClientEnum } from './client.enum';
import { MigrationTypeEnum } from './migration-type.enum';
import { Logger } from './logger.type';
import { ConsoleLogger } from './console-logger';


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
  log: Logger;
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
  log?: Logger;
}

export const ConfigParametersDefaults = {
  client: ClientEnum.PG,
  directory: './migrations',
  migrationType: MigrationTypeEnum.SQL,
  fileRegex: /\d+[\w-]+\.sql$/,
  log: new ConsoleLogger()
};