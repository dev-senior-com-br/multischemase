import fs from 'fs';
import { parse } from 'comment-json';
import { join } from 'path';
import { Resolver } from '../interfaces/resolver.interface';
import { 
  Config, 
  MultischemaseConfiguration, 
  ConfigMultischemaseDefaults 
} from './config.interface';
import { ConfigTypeEnum } from './config-type.enum';

export class ConfigResolver 
implements Resolver<Config, MultischemaseConfiguration> {
  public resolve(params: MultischemaseConfiguration): Config {
    if(!params.config && !params.configFile) { //Apply default
      params.configFile = 'multischemase.json';
    }
    if(!params.type) {
      params.type = ConfigTypeEnum.Multischemase;
    }
    let config: any = {};
    if(params.configFile) {
      const configString = (params.configFile as string);
      if(!fs.existsSync(configString)) {
        throw new Error(`Cannot find configuration file: ${join(process.cwd(), configString)}.` +
        'Please specify a valid configuration file.');
      }
      try {
        const json = parse(fs.readFileSync(configString, 'utf-8'));
        config = { ...json };  
      } catch (error) {
        console.error(error.message, error.stack);
        throw new Error(
          `Could not parse and read configuration file: ${join(process.cwd(), configString)}`,
        );
      }
    } else {
      config = params.config;
    }
    if(params.type === ConfigTypeEnum.Knexfile) {
      return {
        type: params.type,
        knex: config
      };
    } else if(params.type === ConfigTypeEnum.Multischemase) {
      config = { ...ConfigMultischemaseDefaults, ...config };
      if(!fs.existsSync(config.directory)) {
        throw new Error(
          `Cannot find migrations directory on path ${join(process.cwd(), config.directory)}.` + 
          'Please specify a valid migrations directory.'
        );
      }
      return {
        type: params.type,
        multischemase: config
      };
    } else {
      throw new Error(`Config type '${params.type}' not supported.`);
    }
  }
}