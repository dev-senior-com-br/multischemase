import { IBuilder } from './builder.interface';
import { IConfig } from './config.interface';
export interface IConnectorBuilder<T> extends IBuilder<T> {
    setConfig(config: IConfig): IConnectorBuilder<T>;
}