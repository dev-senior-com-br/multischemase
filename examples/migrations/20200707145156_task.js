exports.up = function(knex) {
  return knex.schema.createTable('tasks', function(table) {
    table.uuid('id').primary();
    table.string('name');
    table.uuid('assignee').references('users.id');
  });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('tasks');
};
