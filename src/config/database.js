const { Sequelize } = require('sequelize');

// Conexión con PostgreSQL
const sequelize = new Sequelize('postgresql://databaseproject_owner:npg_OGmYVb1la0Io@ep-rapid-field-a43r0ieo-pooler.us-east-1.aws.neon.tech/databaseproject?sslmode=require', {
  dialect: 'postgres',
  logging: false, // Desactivar los logs SQL
});

module.exports = sequelize;