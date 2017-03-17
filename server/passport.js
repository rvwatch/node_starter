var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt");

module.exports = function (app, models, passport) {
    var pool = app.get('pool');

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        models.User.findById(id)
            .then(function (user) {
                done(null, user);
            });
    });

    passport.use('local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            models.User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {
                if (!user) {
                    console.log(`${email} tried to log in, we don't know them.`);
                    //more descriptive or more "secure"
                    return done(null, false, {message: 'Wrong user name or password!'});
                }
                else {
                    bcrypt.compare(password, user.password).then(function(res) {
                         if(res){
                             console.log(`${user.name} (${user.id} ) logged in.`);
                             return done(null, user);
                         }
                         else {
                             return done(null, false, {message: 'Wrong user name or password!'});
                         }
                    });
                }
            });
        }));
};
