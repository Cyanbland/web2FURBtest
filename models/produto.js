const sequelize = require('../database/');
const { DataTypes } = require('sequelize');
const Usuario = require('./usuario');


const Produto = sequelize.define('Produto', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Produto.belongsToMany(Usuario, { through: 'UsuarioProduto'});

module.exports = Produto;