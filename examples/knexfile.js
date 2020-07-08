// Update with your config settings.

module.exports = {

  staging: {
    client: 'postgresql',
    connection: {
      database: 'localhost',
      user:     'postgres',
      password: 'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'localhost',
      user:     'postgres',
      password: 'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'migrations'
    }
  }

};
