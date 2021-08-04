const sequelize = require('../database/');
const { DataTypes } = require('sequelize');


const Produto = sequelize.define('Produto', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 40]
        }
    },
    preco: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            isDecimal: true,
            min: 0
        }
    }
});

const registerProduto = async ({ nome, preco }) => {
    return await Produto.create({ nome, preco });
};

const getProduto = async (id) => {
    return await Produto.findByPk(id);
};

const getProdutos = async () => {
    const produtos = await Produto.findAll();

    return produtos;
};

module.exports = { registerProduto, getProduto, getProdutos, Produto };

