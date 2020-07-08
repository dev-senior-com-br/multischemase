import { MultischemaseConfiguration } from "./lib/configuration/config.interface";
import Knex from "knex";
import { IMultischemase } from './lib/core/multischemase';
import { CustomKnexMultischemase } from './lib/knex/custom-knex-multischemase';
import { KnexMultischemase } from './lib/knex/knex-multischemase';

async function MultischemaseCtor(configuration: MultischemaseConfiguration): Promise<IMultischemase<Knex>> {
    const multischemase = new CustomKnexMultischemase(configuration);
    await multischemase.testConnection();
    return multischemase;
}

async function MultischemaseKnexCtor(knex: Knex | Knex.Config): Promise<IMultischemase<Knex>> {
    const multischemase = new KnexMultischemase(knex);
    await multischemase.testConnection();
    return multischemase;
}

// export async function MultischemaseSequelizeCtor(client: Sequelize): Promise<Multischemase<Sequelize>> {};
// MultischemaseCtor.prototype.Sequelize = MultischemaseSequelizeCtor;
const Multischemase = {
    Knex: MultischemaseKnexCtor,
    Custom: MultischemaseCtor,
    // Sequelize: MultischemaseSequelizeCtor
};
export default Multischemase;
