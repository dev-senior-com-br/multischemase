import Knex from 'knex';
import { Context } from '../interfaces/context.interface';
import { KnexMigrator } from './migrator/knex-migrator';
import { ListInfo } from '../interfaces/list-info.interface';
import { IMultischemase } from '../interfaces/multischemase.interface';
import { Multischemase } from '../core/multischemase';

export class KnexMultischemase extends Multischemase implements IMultischemase {
  protected migrator: KnexMigrator;
  constructor(knex: Knex | Knex.Config) {
    super();
    let config: Knex.Config;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if(!(knex as any).select) {
      config = (knex as Knex.Config);
    } else {
      config = { ...(knex as Knex).client.config };
    }
    this.migrator = new KnexMigrator(config);
  }
  public testConnection(): Promise<void> {
    return this.migrator.testConnection();
  }
  public getClient(): Knex {
    return this.migrator.getClient();
  }
  protected onMigrate(): Promise<void> {
    return this.migrator.migrate();
  }
  protected onList(): Promise<ListInfo> {
    return this.migrator.list();
  }
  protected onCurrent(): Promise<string> {
    return this.migrator.current();
  }
  protected onDestroy(): void {
    this.migrator.destroy();
  }
  protected onContextChange(context: Context): void {
    this.migrator.reload(context);
  }
  onClean(): Promise<void> {
    return this.migrator.clean();
  }

}