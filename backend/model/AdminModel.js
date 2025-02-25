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