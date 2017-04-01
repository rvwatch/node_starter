'use strict';
var bcrypt = require("bcrypt");
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        name: DataTypes.STRING,
        role: DataTypes.ENUM('user','admin'),
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        resetToken: DataTypes.STRING,
        resetTokenExpires: DataTypes.DATE
    }, {
        instanceMethods: {
            validPassword: function (password) {
                return bcrypt.compareSync(password, this.password);
            }
        },
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            },
            hash: function (password) {
                bcrypt.hash(password, 8, function(err, hash) {
                });

                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            }
        }
    });
    return User;
};
