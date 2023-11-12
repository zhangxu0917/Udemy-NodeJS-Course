const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Cart = sequelize.define("Cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
});

module.exports = Cart;
