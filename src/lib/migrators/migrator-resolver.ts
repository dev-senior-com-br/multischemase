import { KnexMigrator } from './knex';
import { Resolver } from '../interfaces';
import { Migrator } from '.';
import { MigratorBuilder } from '.';
import { MigrationTypeEnum } from '../configuration';
import { ClientEnum } from '../configuration';

export class MigratorResolver
implements Resolver<MigratorBuilder<Migrator>, ResolveParams> {
  resolve(params: ResolveParams): MigratorBuilder<Migrator> {
    if (
      params.fileType === MigrationTypeEnum.SQL &&
      params.client === ClientEnum.PG
    ) {
      return KnexMigrator.builder();
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
