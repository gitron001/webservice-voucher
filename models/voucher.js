const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Voucher = sequelize.define('Voucher', {
  companyID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stationID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  barCode: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Voucher;
