const sequelize = new require("sequelize");
const db = new sequelize("api", "root" , "qwerty12345", {
    dialect: 'mysql'
});

db.sync({});

module.exports = db;
