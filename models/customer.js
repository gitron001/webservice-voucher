const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Customer = sequelize.define('Customer', {
  customerID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customerName: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
  cardNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cardUser: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
  vehiclePlate: {
    type: DataTypes.STRING(12),
    allowNull: false,
  },
  vehicleFuel: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
});

module.exports = Customer;
