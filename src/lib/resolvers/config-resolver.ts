import { IResolver } from '../interfaces/resolver.interface';
import { IConfig } from '../interfaces';
import fs from 'fs';

export class ConfigResolver implements IResolver<IConfig, string> {
  public resolve(params: string): IConfig {
    if(fs.existsSync(params)) {
      try {
        return JSON.parse(fs.readFileSync(params, 'utf-8'));  
      } catch (error) {
        console.error(error.message, error.stack);
        throw new Error(
          `Could not parse and read configuration file: ${params}`,
        );
      }
    }
    throw new Error(`Cannot find configuration file: ${params}`);
  }
}