import { KnexConnector } from '../connectors/knex-connector';
import { IResolver } from '../interfaces/resolver.interface';
import { IConnector } from '../interfaces/connector.interface';
import { IConnectorBuilder } from '../interfaces/connector-builder.interface';
import { MigrationTypeEnum } from '../enums/migration-type.enum';
import { ClientEnum } from '../enums/client.enum';

export class ConnectorResolver
implements IResolver<IConnectorBuilder<IConnector>, ResolveParams> {
  resolve(params: ResolveParams): IConnectorBuilder<IConnector> {
    if (
      params.fileType === MigrationTypeEnum.SQL &&
      params.client === ClientEnum.PG
    ) {
      return KnexConnector.builder();
    } else {
      throw new Error(
        `Filetype '${params.fileType}' and ` +
          `client '${params.client}' not supported`
      );
    }
  }
}

interface ResolveParams {
  fileType: MigrationTypeEnum;
  client: ClientEnum;
}
