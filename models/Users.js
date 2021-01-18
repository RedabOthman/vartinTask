
const { Model } = require('objection');

const knex = require('../config/knex');
Model.knex(knex);

class Users extends Model {
    static get tableName() {
        return 'users';
    }
    static get jsonSchema() {
        return {
            type: "object",
            properties: {
                id: { type: "integer" },
                email: {type: "string"},
                password: { type: "string" },
                userName: { type: "string" }
            }
        };
    }
}

async function createSchema() {
    if (await knex.schema.hasTable('users')) {
        return;
    }
}
module.exports = Users ;