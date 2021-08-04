const sequelize = require('../database/');
const { DataTypes } = require('sequelize');
const Produto = require('./produto');
const { Usuario } = require('./usuario');


const Comanda = sequelize.define('Comanda', {
    idComanda: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

Comanda.belongsToMany(Produto, { through: 'ComandaProduto' });
Produto.belongsToMany(Comanda, { through: 'ComandaProduto' });
Usuario.hasMany(Comanda);
Comanda.belongsTo(Usuario);


const getComandas = async () => {
    const comandas = await Comanda.findAll({attributes: ['idComanda']});

    return comandas;
};

const getComanda = async (id) => {
    const comanda = await Comanda.findByPk(id, { include: Usuario });

    return comanda;
};

const getUsuarioFromComanda = async (idComanda) => {
    const comanda = await Comanda.findByPk(idComanda);

    return await comanda.getUsuario();
};

const registerComanda = async ({ idUsuario, nomeUsuario, telefoneUsuario, produtos }) => {
    return comanda = await Comanda.create({ idUsuario, nomeUsuario, telefoneUsuario, produtos });
}

const associateUsuarioToComanda = async (idUsuario, idComanda) => {
    const comanda = await Comanda.findByPk(idComanda);
    const usuario = await Usuario.findByPk(idUsuario);

    return await comanda.setUsuario(usuario);
}

module.exports = { Comanda, getComanda, getComandas, getUsuarioFromComanda, registerComanda, associateUsuarioToComanda };
