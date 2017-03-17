module.exports = function (app, pg) {
    var env = process.env.NODE_ENV || 'development';
    var config = require(__dirname + '/../server/config.json')[env];

    app.set('dbstring', `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`);

    // var pool = new pg.Pool(app.get("dbstring"));
    //   pool.connect(function(err) {
    //     if(err) {
    //       return console.error("can't connect to DB", err);
    //     }
    //     pool.query('select NOW() as "time"', function(err, result) {
    //       if(err) {
    //         console.error("can't query postgres", err);
    //       }
    //       console.log(`Started at: ${result.rows[0].time}`);
    //     });
    //   });

    //   pool.on('error', function (err, client) {
    //     console.error('idle client error from connection pool', err.message, err.stack)
    //   })

    //  return pool;
};
