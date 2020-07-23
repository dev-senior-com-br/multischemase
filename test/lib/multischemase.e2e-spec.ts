import Knex from 'knex';
import { parse } from 'comment-json';
import { readFileSync } from 'fs';
import { 
  MULTISCHEMASE_JSON, 
  CONTEXT_1, 
  CONTEXT_3, 
  TEST_MIGRATION_SOURCE, 
  CONTEXT_2, 
  TABLE_DISTRIBUTORS,
  TABLE_FILMS,
  RAW_QUERY_EXISTS
} from '../constants';
import { Multischemase, Custom } from '../../src';
const parsedConfig = parse(readFileSync(MULTISCHEMASE_JSON.get(), 'utf-8'));

const knex = Knex(parsedConfig);

let multischemase: Multischemase;
describe('Multischemase lib (e2e) on postgres', () => {
  beforeAll(async () => {
    multischemase = await Custom(MULTISCHEMASE_JSON.get());
  });
  beforeEach(async () => {
    await knex.raw(`CREATE SCHEMA IF NOT EXISTS ${CONTEXT_1.get()}`);
    await knex.raw(`CREATE SCHEMA IF NOT EXISTS ${CONTEXT_3.get()}`);
    const schemaKnex = Knex({ ...parsedConfig, searchPath: CONTEXT_3.get() });
    try {
      await schemaKnex.migrate.latest({
        schemaName: CONTEXT_3.get(),
        migrationSource: TEST_MIGRATION_SOURCE.get()
      });
    } finally {
      schemaKnex.destroy();
    }
  });
  afterEach(async () => {
    await knex.raw(`DROP SCHEMA IF EXISTS ${CONTEXT_1.get()} CASCADE`);
    await knex.raw(`DROP SCHEMA IF EXISTS ${CONTEXT_2.get()} CASCADE`);
    await knex.raw(`DROP SCHEMA IF EXISTS ${CONTEXT_3.get()} CASCADE`);
  });
  afterAll(async () => {
    knex.destroy();
    multischemase.destroy();
  });

  describe('Migrate', () => {
    it('Should migrate on existing schema', async () => {
      //Arrange
      multischemase.setContext(CONTEXT_1.get());
      //Act
      await multischemase.migrate(); 
      //Assert 
      await expect(knex.raw(RAW_QUERY_EXISTS.get(CONTEXT_1.get(), TABLE_DISTRIBUTORS.get())))
        .resolves.toHaveProperty('rows', [{ exists: true }]);
      await expect(knex.raw(RAW_QUERY_EXISTS.get(CONTEXT_1.get(), TABLE_FILMS.get())))
        .resolves.toHaveProperty('rows', [{ exists: true }]);
    });
    it('Should migrate on non existing schema', async () => {
      //Arrange
      multischemase.setContext(CONTEXT_2.get());
      //Act
      await multischemase.migrate();
      //Assert
      await expect(knex.raw(RAW_QUERY_EXISTS.get(CONTEXT_2.get(), TABLE_DISTRIBUTORS.get())))
        .resolves.toHaveProperty('rows', [{ exists: true }]);
      await expect(knex.raw(RAW_QUERY_EXISTS.get(CONTEXT_2.get(), TABLE_FILMS.get())))
        .resolves.toHaveProperty('rows', [{ exists: true }]);
    });
    it('Should migrate on half migrated schema', async () => {
      //Arrange
      multischemase.setContext(CONTEXT_3.get());
      //Act
      await multischemase.migrate();
      //Assert
      await expect(knex.raw(RAW_QUERY_EXISTS.get(CONTEXT_3.get(), TABLE_DISTRIBUTORS.get())))
        .resolves.toHaveProperty('rows', [{ exists: true }]);
      await expect(knex.raw(RAW_QUERY_EXISTS.get(CONTEXT_3.get(), TABLE_FILMS.get())))
        .resolves.toHaveProperty('rows', [{ exists: true }]);
    });
  });
  describe('Clean', () => {
    it('Should clean a half migrated schema', async () => {
      //Arrange
      multischemase.setContext(CONTEXT_3.get());
      //Act
      await multischemase.clean();
      //Assert
      await expect(knex.raw(RAW_QUERY_EXISTS.get(CONTEXT_3.get(), TABLE_FILMS.get())))
        .resolves.toHaveProperty('rows', [{ exists: false }]);
    });
  });
  describe('List', () => {
    it('Should list migrated migrations on migrated schema', async () => {
      //Arrange
      const schemaKnex = Knex({ ...parsedConfig, searchPath: CONTEXT_1.get() });
      try {
        await schemaKnex.migrate.latest({
          schemaName: CONTEXT_1.get(),
          migrationSource: TEST_MIGRATION_SOURCE.get(2)
        });
      } finally {
        schemaKnex.destroy();
      }
      multischemase.setContext(CONTEXT_1.get());
      //Act
      const list = await multischemase.list();
      //Assert
      expect(list).toEqual({ migrated: ['1111-task.sql', '2222-task.sql'], pending: [] });
    });
    it('Should list pending migrations on pending schema', async () => {
      //Arrange
      multischemase.setContext(CONTEXT_1.get());
      //Act
      const list = await multischemase.list();
      //Assert
      expect(list).toEqual({ migrated: [], pending: ['1111-task.sql', '2222-task.sql'] });
    });
  });
  describe('Current', () => {
    it('Should show current migration on half migrated schema', async () => {
      //Arrange
      multischemase.setContext(CONTEXT_3.get());
      //Act
      const current = await multischemase.current();
      //Assert
      expect(current).toEqual('1111-task.sql');
    });
    it('Should show current migration on full migrated schema', async () => {
      //Arrange
      const schemaKnex = Knex({ ...parsedConfig, searchPath: CONTEXT_1.get() });
      try {
        await schemaKnex.migrate.latest({
          schemaName: CONTEXT_1.get(),
          migrationSource: TEST_MIGRATION_SOURCE.get(2)
        });
      } finally {
        schemaKnex.destroy();
      }
      multischemase.setContext(CONTEXT_1.get());
      //Act
      const current = await multischemase.current();
      //Assert
      expect(current).toEqual('2222-task.sql');
    });
  });
});
