const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "pet_hospital",
  password: "admin",
  port: 54320,
});

module.exports = pool;
