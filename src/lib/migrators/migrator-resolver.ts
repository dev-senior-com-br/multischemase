import { Resolver } from '../interfaces/resolver.interface';
import { Migrator } from './migrator.interface';
import { MigratorBuilder } from './migrator-builder.interface';
import { MigrationTypeEnum } from '../configuration/migration-type.enum';
import { ClientEnum } from '../configuration/client.enum';
import { KnexMigrator } from './knex/knex-migrator';

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
