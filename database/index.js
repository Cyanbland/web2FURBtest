const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
  });

const syncDb = async () => {
    await sequelize.sync({force: true});
    console.log("Models synchronized.");
}

syncDb();

module.exports = sequelize;