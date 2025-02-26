const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/DBConnection');

const Admin = sequelize.define(
    'Admin',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password_history: {
            type: DataTypes.JSON, // Store previous passwords as an array
            allowNull: true,
            defaultValue: []
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        verificationToken: {
            type: DataTypes.STRING,
        },
        tokenExpires: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: 'admin',
    },
);


module.exports = { Admin };