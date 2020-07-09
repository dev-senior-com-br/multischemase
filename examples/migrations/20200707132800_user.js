
exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
        table.uuid('id').primary();
        table.string('name');
        table.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};

