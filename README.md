Node/Express project starter

Passport for auth + Sequelize as ORM

You'll want a config.json in server/ with some sensitive stuff:  (It's ignored by .gitignore)

```javascript
{
  "development": {
    "username": "",
    "password": "",
    "database": "node_starter",
    "host": "127.0.0.1",
    "port": "5432",
    "dialect": "postgres",
    "seederStorage": "sequelize"
  },
  "test": {
    "username": "",
    "password": "",
    "database": "node_starter",
    "host": "127.0.0.1",
    "port": "5432",
    "dialect": "postgres"
  },
  "production": {
    "username": "",
    "password": "",
    "database": "node_starter",
    "host": "127.0.0.1",
    "port": "5432",
    "dialect": "postgres"
  }
}```