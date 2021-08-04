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
            len: [1, 40],
            isAlphanumeric: true
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

module.exports = Produto;