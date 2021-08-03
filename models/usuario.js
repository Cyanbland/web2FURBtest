const sequelize = require('../database/');
const { DataTypes } = require('sequelize');
const Produto = require('./produto');


const Usuario = sequelize.define('Usuario', {
    idUsuario: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    nomeUsuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefoneUsuario: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Usuario.belongsToMany(Produto, { through: 'UsuarioProduto'});

module.exports = Usuario;