const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Ensure your database connection is correctly configured here

const Transaction = sequelize.define('Transaction', {
    stationID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pumpNo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nozzleNo: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
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
        allowNull: true // Allow null since it may not always be present
    },
    rfidCard: {
        type: DataTypes.INTEGER,
        allowNull: true // Allow null since it may not always be present
    },
    vrsTag: {
        type: DataTypes.INTEGER,
        allowNull: true // Allow null since it may not always be present
    },
    cardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0 // Default to 0 to indicate no card used
    }
}, {
    timestamps: true,
    tableName: 'Transactions'
});

module.exports = Transaction;
