import { MigrationTypeEnum } from '.';
import { ClientEnum } from '.';
import { Logger } from '.';
import { ConsoleLogger } from '.';

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