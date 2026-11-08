require('dotenv').config();
const { Pool } = require('pg');

const conexion = new Pool({
  connectionString: process.env.URL_BASE_DATOS,
  ssl: { rejectUnauthorized: false },
});

module.exports = conexion;