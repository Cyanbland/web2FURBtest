const sequelize = require('../database/');
const { DataTypes } = require('sequelize');
const { Produto, getProduto } = require('./produto');
const { Usuario, getUsuario } = require('./usuario');


const Comanda = sequelize.define('Comanda', {
    idComanda: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

Produto.belongsToMany(Comanda, { through: 'ComandaProduto' });
Comanda.belongsToMany(Produto, { through: 'ComandaProduto' });
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

const getAssociatedProdutos = async (idComanda) => {
    const comanda = await Comanda.findByPk(idComanda);
    const produtos = await comanda.getProdutos();

    return produtos;
}

const registerComanda = async ({ idUsuario, nomeUsuario, telefoneUsuario, produtos }) => {
    return comanda = await Comanda.create({ idUsuario, nomeUsuario, telefoneUsuario, produtos });
};

const associateUsuarioToComanda = async (idUsuario, idComanda) => {
    const comanda = await Comanda.findByPk(idComanda);
    const usuario = await Usuario.findByPk(idUsuario);

    return await comanda.setUsuario(usuario);
};

const associateProdutoToComanda = async (idComanda, idProduto) => {
    const comanda = await Comanda.findByPk(idComanda);
    const produto = await Produto.findByPk(idProduto, { attributes: ['id', 'nome', 'preco']});

    return await comanda.addProduto(produto);
};

const destroyComandaById = async (idComanda) => {
    return await Comanda.destroy({ where: { idComanda } });
};

const saveComandaChangesById = async (idComanda) => {
    const comanda = await Comanda.findByPk(idComanda);

    return await comanda.save(); 
};

const checkIfProdutoInComanda = async (idProduto, idComanda) => {
    const comanda = await Comanda.findByPk(idComanda);
    const produto = await Produto.findByPk(idProduto);

    if (await comanda.hasProduto(produto)) {
        return true;
    }

    return false; 

};

module.exports = { Comanda, getComanda, getComandas, getUsuarioFromComanda, getAssociatedProdutos, registerComanda, associateUsuarioToComanda, associateProdutoToComanda, destroyComandaById, saveComandaChangesById, checkIfProdutoInComanda };
