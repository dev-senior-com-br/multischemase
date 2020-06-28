import { IBuilder } from './builder.interface';
import { Config } from './config.interface';
export interface IConnectorBuilder<T> extends IBuilder<T> {
    setConfig(config: Config): IConnectorBuilder<T>;
}