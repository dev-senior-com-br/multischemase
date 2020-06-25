import { FileTypeEnum, ClientEnum } from '../enums';
import { KnexConnector } from './knex-connector';

export class ConnectorResolver {
  static resolve(fileType: FileTypeEnum, client: ClientEnum) {
    if (fileType === FileTypeEnum.SQL && client === ClientEnum.PG) {
      return KnexConnector;
    } else {
      throw new Error(
        `Filetype '${fileType}' and client '${client}' not supported`
      );
    }
  }
}
