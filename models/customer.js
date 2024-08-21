const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Adjust the path as necessary

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
        type: DataTypes.INTEGER(10),
        allowNull: false,
    },
    cardUser: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
    vehiclePlate: {
        type: DataTypes.STRING(12),
        allowNull: true,
    },
    vehicleFuel: {
        type: DataTypes.STRING(16),
        allowNull: true,
    },
    disable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    }
}, {
    tableName: 'Customers',  // Ensure this matches the table name in your database
    timestamps: true, // Automatically handles `createdAt` and `updatedAt`
});

module.exports = Customer;