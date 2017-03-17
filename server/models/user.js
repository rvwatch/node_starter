'use strict';
var bcrypt = require("bcrypt");
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        instanceMethods: {
            generateHash: function (password) {
                bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
                    // Store hash in your password DB.
                });

                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            },
            validPassword: function (password) {
                return bcrypt.compareSync(password, this.password);
            },
        },
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    return User;
};
