import { IBuilder } from './builder.interface';
import { IConfig } from './config.interface';
import { Observable } from 'rxjs';
import { IContext } from './context.interface';
export interface IConnectorBuilder<T> extends IBuilder<T> {
    setConfig(config: IConfig): IConnectorBuilder<T>;
    setContextObs(contextObs: Observable<IContext>): IConnectorBuilder<T>;
}