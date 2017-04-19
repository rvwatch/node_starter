var nodemailer = require('nodemailer');

module.exports = function (app) {
    var config = app.get('config');

    var transport;

    if (config.mail.transport == "stream") {
        transport = nodemailer.createTransport({
            jsonTransport: true
        });
    } else {
        transport = nodemailer.createTransport(config.mail.transport, {
            service: `${config.mail.service}`,
            auth: {
                user: `${config.mail.user}`,
                pass: `${config.mail.credentials}`
            }
        });
    }

    return transport;
};