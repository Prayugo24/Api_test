const sequelize = require('sequelize')
const db = require('../config/connection')

const User = db.define(
    "users",
    {
        'username':{type: sequelize.STRING},
        'password': {type:sequelize.STRING},
    },
    {
        freezeTableName:true
    }
);
module.exports = User
