import { IResolver } from '../interfaces/resolver.interface';
import fs from 'fs';
import { ConfigMultischemase, 
  ConfigParametersDefaults, 
  Config } from '../interfaces/config.interface';
import { parse } from 'comment-json';

export class ConfigResolver 
implements IResolver<Config, string | ConfigMultischemase> {
  public resolve(params: string | ConfigMultischemase): Config {
    let config: Config = { ...ConfigParametersDefaults };
    if(typeof params === 'string') {
      if(!fs.existsSync(params)) {
        throw new Error(`Cannot find configuration file: ${params}`);
      }
      try {
        const json = parse(fs.readFileSync(params, 'utf-8'));
        config = { ...config, ...json };  
      } catch (error) {
        console.error(error.message, error.stack);
        throw new Error(
          `Could not parse and read configuration file: ${params}`,
        );
      }
    } else {
      config = { ...config, ...params };
    }
    return config;
  }
}