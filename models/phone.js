const Sequelize = require('sequelize');
// Import the database connection from the configuration
const database = require('../config/database');

// Define the 'Phone' model with Sequelize and specifying their attributes
const Phone = database.define('Phone', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  number: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  comment: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  UserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
},{
  timestamps: false,
  freezeTableName: true
});

module.exports = Phone;