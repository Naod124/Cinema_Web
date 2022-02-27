const knex = require("knex"); 

const connectedKnex = knex({
client: "sqlite3",
connection: {
    filename: "Filmvisarna.sqlite3"
}
}); 

module.exports = connectedKnex; 