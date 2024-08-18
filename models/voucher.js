const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Voucher = sequelize.define('Voucher', {
    stationID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    transNo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    barCode: {
        type: DataTypes.STRING(16),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1 // 1 = valid, 2 = used or can be deleted
    }
});

module.exports = Voucher;
