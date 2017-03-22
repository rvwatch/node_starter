var session = require('express-session');
var RedisStore = require('connect-redis')(session);

module.exports = function (app) {
    app.set('sessionStore', new RedisStore({
            url: app.get('redisUrl'),
            disableTTL: true,
            logErrors: function (str) {
                app.get('logger').error(str);
            }}));

    var sess = {
        name: 'sid',
        store: app.get('sessionStore'),
        secret: 'ahsfd07yaysjo8v76asbdfbiosa12#!@',
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            signed: false
        },
        resave: false,
        saveUninitialized: false
    }

    if (app.get('env') === 'production') {
        app.set('trust proxy', 1);
        sess.cookie.secure = true;
    }

    return sess;
};