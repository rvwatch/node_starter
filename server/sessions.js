var session = require('express-session');
var RedisStore = require('connect-redis')(session);

module.exports = function (app) {
    var config = app.get('config');
    var maxAge = config.sessionExpirationDays * 24 * 60 * 60 * 1000;

    app.set('sessionStore', new RedisStore({
            url: app.get('redisUrl'),
            disableTTL: true,
            logErrors: function (str) {
                app.get('logger').error(str);
            }}));

    var sess = {
        name: 'sid',
        store: app.get('sessionStore'),
        secret: app.get('config').secret,
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: maxAge,
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