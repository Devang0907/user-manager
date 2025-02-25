const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/DBConnection');

const Admin = sequelize.define(
    'Admin',
    {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'admin',
    },
);


module.exports = { Admin };