const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_complete", "root", "admin", {
  dialect: "mysql",
  host: "localhost",
  port: 3306,
});

module.exports = sequelize;
