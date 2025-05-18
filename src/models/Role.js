const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  role_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Role;