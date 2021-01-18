
exports.up = (knex) => {
    return knex.schema.createTable('users', (able) => {
      table.increments('id').primary();
      table.string('email');
      table.string('password');
      table.string('userName');
    });
  };
  
  exports.down = (knex) => {
    return knex.schema.dropTableIfExists('users');
  };