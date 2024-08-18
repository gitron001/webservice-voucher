const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Adjust the path as necessary

const Customer = sequelize.define('Customer', {
    customerID: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true
    },
    customerName: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    cardNumber: {
        type: DataTypes.INTEGER(10),
        allowNull: false
    },
    cardUser: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    vehiclePlate: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    vehicleFuel: {
        type: DataTypes.STRING(16),
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
    tableName: 'Customers',
    timestamps: true
});

module.exports = Customer;
