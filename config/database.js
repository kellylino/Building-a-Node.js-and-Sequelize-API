const Sequelize = require('sequelize');

// Create a Sequelize connection instance with SQLite and a local storage file
const connection = new Sequelize({
  dialect: "sqlite",
  storage: "./databese.db",// Specify the path to the SQLite database file
});

module.exports =  connection;