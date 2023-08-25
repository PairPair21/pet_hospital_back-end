const { Pool, Client } = require("pg");

const pool = new Pool({
  connectionString:
    "postgres://ltbjcuvi:UYKzdaQFCQ3FyArRw92rcQpsZiw7VCP4@bubble.db.elephantsql.com/ltbjcuvi",
});

module.exports = pool;
