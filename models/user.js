const Sequelize = require('sequelize');
// Import the database connection from the configuration
const database = require('../config/database');

// Define the 'User' model with Sequelize and specifying their attributes
const User = database.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = User;
