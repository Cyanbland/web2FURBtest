const sequelize = require('../database/');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');


const Usuario = sequelize.define('Usuario', {
    idUsuario: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    nomeUsuario: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 40],
            isAlphanumeric: true
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
    },
    telefoneUsuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isNumeric: true,
            len: [6, 16]
        }
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    throw Error('Invalid credentials!');
};

const registerUsuario = async ( {nomeUsuario, telefoneUsuario, email, senha} ) => {
    return await Usuario.create({ nomeUsuario, telefoneUsuario, email, senha, isAdmin: false });
};

const getUsuario = async(id) => {
    return await Usuario.findByPk(id);
};



module.exports = { Usuario, loginUsuario, registerUsuario, getUsuario };