'use strict';
var bcrypt = require("bcrypt");
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        name: DataTypes.STRING,
        role: DataTypes.ENUM('user', 'admin'),
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        resetToken: DataTypes.STRING,
        resetTokenExpires: DataTypes.DATE,
        confirmToken: DataTypes.STRING,
        confirmed: DataTypes.BOOLEAN,
        subscription: DataTypes.INTEGER,
        billingCustomerId: DataTypes.STRING,
        billingSubscriptionId: DataTypes.STRING,
        billingPeriodEnd: DataTypes.INTEGER,
        billingEndedAt: DataTypes.INTEGER
    }, {
        instanceMethods: {
            validPassword: function (password) {
                return bcrypt.compareSync(password, this.password);
            },
            sanitize: function () {
                var data = this.get();
                delete data.id;
                delete data.password;
                delete data.resetToken;
                delete data.resetTokenExpires;
                delete data.confirmToken;
                return data;
            },
            planStatus: function() {
                var planEnd = this.get().billingEndedAt;
                var planStatus = 'Active';
                if(planEnd != null) {
                    if(planEnd > new Date().getTime()) {
                        planStatus = 'Canceling';
                    }
                    else {
                        planStatus = 'Cancelled';
                    }
                }
                return planStatus;
            },
            planType: function() {
                var planType = "NONE";
                switch(this.get().subscription) {
                    case 1:
                        planType = "MONTHLY";
                        break;
                    case 2:
                        planType = "YEARLY";
                        break;
                    case 3:
                        planType = "COMP";
                        break;
                }
                return planType;
            }
        },
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            },
            hash: function (password) {
                bcrypt.hash(password, 8, function (err, hash) {
                });

                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            }
        }
    });
    return User;
};
