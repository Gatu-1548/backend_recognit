const { Sequelize } = require('sequelize');
require('dotenv').config(); // Asegura que puedas leer variables del archivo .env

// Conexión con PostgreSQL desde .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
