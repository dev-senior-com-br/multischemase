import { Builder } from '../interfaces/builder.interface';
import { Config } from '../configuration/config.interface';

export interface MigratorBuilder<T> extends Builder<T> {
    setConfig(config: Config): MigratorBuilder<T>;
}