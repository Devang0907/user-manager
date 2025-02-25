const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('user_management', 'root', '17124480', {
    host: 'localhost',
    port:3306,
    dialect: 'mysql'
});

const DBConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports={DBConnection , sequelize};