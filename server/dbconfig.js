module.exports = function (app) {
    var env = process.env.NODE_ENV || 'development';
    var config = require(__dirname + '/../server/config.json')[env];

    app.set('dbstring', `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`);
};
