const sequelize = require('../database/');
const { DataTypes } = require('sequelize');
const Produto = require('./produto');
const { Usuario } = require('./usuario');


const Comanda = sequelize.define('Comanda', {
    idComanda: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    }
});

Comanda.belongsToMany(Produto, { through: 'ComandaProduto' });
Produto.belongsToMany(Comanda, { through: 'ComandaProduto' });
Comanda.hasOne(Usuario);
Usuario.belongsTo(Comanda);

module.exports = Comanda;
