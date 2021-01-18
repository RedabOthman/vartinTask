
//create connection with db
const { Model } = require("objection");

function connect(env) {
    const knex = require('./knex');
   console.log( knex);
    Model.knex(knex);
 
    return knex;
}

module.exports = connect;