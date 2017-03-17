module.exports = function (app) {
    var sess = {
        secret: 'ahsfd07yaysjo8v76asbdfbiosa12#!@',
        cookie: {},
        resave: false,
        saveUninitialized: true
    }

    if (app.get('env') === 'production') {
        app.set('trust proxy', 1) // trust first proxy
        sess.cookie.secure = true // serve secure cookies
    }

    return sess;
};
