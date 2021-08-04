const sequelize = require('../database/');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');


const Usuario = sequelize.define('Usuario', {
    idUsuario: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    nomeUsuario: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min: 3,
            isAlphanumeric: true
        }
    },
    telefoneUsuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isNumeric: true,
            min: 6
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
});



const loginUsuario = async (email, senha) => {
    const usuario = await sequelize.findOne(email);

    if (usuario) {
        const auth = await bcrypt.compare(senha, usuario.senha);
        
        if (auth) {
            return user;
        }
    }
    throw Error('Invalid login!');
}


module.exports = { Usuario, loginUsuario };