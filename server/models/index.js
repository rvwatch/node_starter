module.exports = function (app) {
    var fs = require('fs');
    var path = require('path');
    var Sequelize = require('sequelize');
    var basename = path.basename(module.filename);
    var env = process.env.NODE_ENV || 'development';
    var config = require(__dirname + '/../config.json')[env];
    var db = {};

    var sequelize = new Sequelize(app.get('dbstring'), config);

    fs
        .readdirSync(__dirname)
        .filter(function (file) {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(function (file) {
            var model = sequelize['import'](path.join(__dirname, file));
            db[model.name] = model;
        });
    ``
    Object.keys(db).forEach(function (modelName) {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    //Export the db Object
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
};
