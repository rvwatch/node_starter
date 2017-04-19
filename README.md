Node/Express project starter

Passport for auth + Sequelize as ORM and client examples with ejs templating.  

Also included is an angular2 client set up with JWT via passport (delete either /ng2 or /client if you don't want both).

Server+ejs is set up with mocha example tests, angular uses protractor/etc.

`npm run` will give you some standard options:
``` 
db
  sequelize
createdb
  sequelize db:migrate && node_modules/.bin/sequelize db:seed:all
killdb
  sequelize db:seed:undo:all && node_modules/.bin/sequelize db:migrate:undo:all
testserver
  mocha
```

Build + run (including angular) with `ng2 build && node bin/www`

You'll want a config.json in server/ with some sensitive stuff (It's ignored by .gitignore):

```javascript
{
  "development": {
    "username": "",
    "password": "",
    "database": "node_starter",
    "host": "127.0.0.1",
    "port": "5432",
    "dialect": "postgres",
    "seederStorage": "sequelize",
    "secret": "",
    "jwtSecret": "",
    "sessionExpirationDays": "7",
    "redis": {
      "host": "localhost",
      "port": "6379"
    },
    "mail": {
      "transport": "stream",
      "service": "stream",
      "user": "none",
      "credentials": "none",
      "reset": {
        "fromDomain": "http://localhost:3000",
        "fromAddress": "test@test.com",
        "application": "testapp",
        "subject": "Test Password Reset"
      }
    }
  },
  "test": {
      "etc":"duplicate your settings here with appropriate values"
  },
  "production": {
      "etc":"duplicate your settings here with appropriate values"
  }
}
```
