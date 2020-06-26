import { IConnectorBuilder } from '../interfaces/connector-builder.interface';
import { KnexConnector } from '../connectors/knex-connector';
import { IConfig } from '../interfaces/config.interface';
import { Observable } from 'rxjs';
import { IContext } from '../interfaces';
export class KnexConnectorBuilder implements IConnectorBuilder<KnexConnector> {
    private config!: IConfig;
    private contextObs!: Observable<IContext>;
    setConfig(config: IConfig): IConnectorBuilder<KnexConnector> {
        this.config = config;
        return this;
    }
    setContextObs(contextObs: Observable<IContext>): IConnectorBuilder<KnexConnector> {
        this.contextObs = contextObs;
        return this;
    }
    build(): KnexConnector {
        if (this.config === null || this.contextObs === null) {
            throw new Error("Config and ContextObservable cannot be null");
        }
        return new KnexConnector(this.config, this.contextObs);
    }
}