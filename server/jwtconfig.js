var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;

module.exports = function (app) {
    var jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
    jwtOptions.secretOrKey = app.get("config").jwtSecret;

    app.set("jwtOptions", jwtOptions);
};