const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/DBConnection');

const User = sequelize.define(
    'User',
    {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNo: {
            type: DataTypes.STRING,
            allowNull: false
        }

    },
    {
        tableName: 'user',
        paranoid: true
    },
);


module.exports = { User };