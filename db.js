const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "TBDatabase",
  password: "Vidnarg1337",
  port: 5432,
});

module.exports = pool;
