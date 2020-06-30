import fs from 'fs';
import { parse } from 'comment-json';
import { join } from 'path';
import { Resolver } from '../interfaces/resolver.interface';
import { Config, ConfigMultischemase, ConfigParametersDefaults } from './config.interface';

export class ConfigResolver 
implements Resolver<Config, string | ConfigMultischemase> {
  public resolve(params: string | ConfigMultischemase): Config {
    let config: Config = { ...ConfigParametersDefaults };
    if(typeof params === 'string') {
      if(!fs.existsSync(params)) {
        throw new Error(`Cannot find configuration file in path ${join(process.cwd(), params)}.` +
        'Please specify a valid configuration file.');
      }
      try {
        const json = parse(fs.readFileSync(params, 'utf-8'));
        config = { ...config, ...json };  
      } catch (error) {
        console.error(error.message, error.stack);
        throw new Error(
          `Could not parse and read configuration file: ${join(process.cwd(), params)}`,
        );
      }
    } else {
      config = { ...config, ...params };
    }
    if(!fs.existsSync(config.directory)) {
      throw new Error(
        `Cannot find migrations directory on path ${join(process.cwd(), config.directory)}.` + 
        'Please specify a valid migrations directory.'
      );
    }
    return config;
  }
}