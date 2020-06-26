import { FileTypeEnum, ClientEnum } from '../enums';
import { KnexConnector } from '../connectors/knex-connector';
import { IResolver } from '../interfaces/resolver.interface';
import { IConnector } from '../interfaces/connector.interface';
import { IConnectorBuilder } from '../interfaces/connector-builder.interface';

export class ConnectorResolver implements IResolver<IConnectorBuilder<IConnector>, ResolveParams> {
  resolve(params: ResolveParams): IConnectorBuilder<IConnector> {
    if (params.fileType === FileTypeEnum.SQL && params.client === ClientEnum.PG) {
      return KnexConnector.builder();
    } else {
      throw new Error(
        `Filetype '${params.fileType}' and client '${params.client}' not supported`
      );
    }
  }
}

interface ResolveParams {
  fileType: FileTypeEnum;
  client: ClientEnum;
}