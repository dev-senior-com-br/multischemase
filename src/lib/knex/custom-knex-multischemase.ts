import { KnexMultischemase } from './knex-multischemase';
import { ConfigMultischemase, ConfigMultischemaseDefaults, Config } from '../interfaces/config.interface';
import { existsSync, readFileSync } from 'fs';
import { parse } from 'comment-json';
import { join } from 'path';
import { IMultischemase } from '../interfaces/multischemase.interface';
export class CustomKnexMultischemase extends KnexMultischemase implements IMultischemase {
  constructor(configuration: ConfigMultischemase | string) {
    const config: Config = resolveConfig(configuration);
    super({
      connection: config.connection,
      client: config.client,
      log: config.log,
      
      migrations: {
        tableName: config.tableName
      }
    });
    this.migrator.setFileRegex(config.fileRegex);
    this.migrator.setDirectory(config.directory);
  }
}

function resolveConfig(configuration: ConfigMultischemase | string): Config {
  let config: Config = { ...ConfigMultischemaseDefaults };
  if(typeof configuration === 'string') {
    if(!existsSync(configuration)) {
      throw new Error(`Cannot find configuration file: ${join(process.cwd(), configuration)}.` +
        'Please specify a valid configuration file.');
    }
    try {
      const json = parse(readFileSync(configuration, 'utf-8'));
      config = { ...config, ...json }; 
    } catch (error) {
      console.error(error.message, error.stack);
      throw new Error(
        `Could not parse and read configuration file: ${join(process.cwd(), configuration)}`,
      );
    }
  } else {
    config = { ...config, ...configuration };
    if(!existsSync(config.directory)) {
      throw new Error(
        `Cannot find migrations directory on path ${join(process.cwd(), config.directory)}.` + 
        'Please specify a valid migrations directory.'
      );
    }
  }
  return config;
}