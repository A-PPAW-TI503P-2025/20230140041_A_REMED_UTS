const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const borrowLog = sequelize.define('borrowLog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    borrowDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = borrowLog;