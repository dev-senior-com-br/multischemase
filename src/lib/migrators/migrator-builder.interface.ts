import { Builder } from '../interfaces';
import { Config } from '../configuration';
export interface MigratorBuilder<T> extends Builder<T> {
    setConfig(config: Config): MigratorBuilder<T>;
}