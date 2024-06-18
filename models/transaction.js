const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Transaction = sequelize.define('Transaction', {
  stationID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pumpNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nozzleNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  liters: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  pumpTransNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transTimedate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  transUnique: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  plate: {
    type: DataTypes.STRING(12),
    allowNull: false,
  },
  rfidCard: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vrsTag: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Transaction;
