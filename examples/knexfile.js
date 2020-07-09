// Update with your config settings.

module.exports = {

  staging: {
    client: 'postgresql',
    connection: {
      database: 'postgres',
      user:     'postgres',
      password: 'postgres',
      host: 'localhost'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'examples/migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'postgres',
      user:     'postgres',
      password: 'postgres',
      host: 'localhost'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'examples/migrations'
    }
  }

};
