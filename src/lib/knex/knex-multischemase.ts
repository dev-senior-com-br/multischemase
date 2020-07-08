import { Multischemase } from '../core/multischemase';
import Knex from 'knex';
import { Context } from '../configuration/context.interface';
export class KnexMultischemase extends Multischemase<Knex> {
    constructor(knex: Knex | Knex.Config) {
        super();
        
    }
    public testConnection(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public getClient(): Promise<Knex<any, unknown[]>> {
        throw new Error("Method not implemented.");
    }
    protected onMigrate(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    protected onList(): Promise<import("../interfaces/list-info.interface").ListInfo> {
        throw new Error("Method not implemented.");
    }
    protected onCurrent(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    protected onDestroy(): void {
        throw new Error("Method not implemented.");
    }
    protected onContextChange(context: Context): void {
        throw new Error("Method not implemented.");
    }
    onClean():Promise<void> {
        throw new Error("Method not implemented.");
    }

}