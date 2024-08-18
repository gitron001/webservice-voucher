const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Adjust the path as necessary

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    stationID: {
        type: DataTypes.INTEGER(2),
        allowNull: false
    },
    pumpNo: {
        type: DataTypes.INTEGER(2),
        allowNull: false
    },
    nozzleNo: {
        type: DataTypes.INTEGER(2),
        allowNull: false
    },
    liters: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false
    },
    pumpTransNo: {
        type: DataTypes.INTEGER(6),
        allowNull: false
    },
    transTimedate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    transUnique: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    plate: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    rfidCard: {
        type: DataTypes.INTEGER(10),
        allowNull: false
    },
    vrsTag: {
        type: DataTypes.INTEGER(10),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Transactions',
    timestamps: true
});

module.exports = Transaction;
