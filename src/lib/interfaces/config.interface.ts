import { ClientEnum } from './client.enum';
import { Logger } from './logger.type';
import { ConsoleLogger } from './console-logger';

export interface Config {
  connection?: ConnectionConfig;
  client: ClientEnum;
  directory: string;
  fileRegex: RegExp;
  log: Logger;
}

export interface ConfigMultischemase {
  connection?: ConnectionConfig;
  client?: ClientEnum;
  directory?: string;
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
  fileRegex: /\d+[\w-]+\.sql$/,
  log: new ConsoleLogger()
};