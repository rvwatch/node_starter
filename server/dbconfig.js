module.exports = function (app) {
    var config = app.get('config');
    app.set('dbstring', `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`);
    app.set('redisUrl', `redis://${config.redis.host}:${config.redis.port}`);
};
