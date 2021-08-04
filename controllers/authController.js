const { registerUsuario } = require('../models/usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const MAXAGE = 24 * 60 * 60; //24 hours

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: MAXAGE
    });
}

const saltPassword = async (password) => {
    const salt = await bcrypt.genSalt();
    return pwd = await bcrypt.hash(password, salt);
}

const createUsuario = async (req, res) => {
    var { nomeUsuario, telefoneUsuario, email, senha } = req.body;

    senha = await saltPassword(senha);
    
    try {
        const usuario = await registerUsuario({ nomeUsuario, telefoneUsuario, email, senha });
        const token = createToken(usuario.idUsuario);
        res.cookie('jwt', token, { httpOnly: true, maxAge: MAXAGE * 1000 });
        const data = { usuario: usuario.idUsuario, nomeUsuario: usuario.nomeUsuario, telefoneUsuario: usuario.telefoneUsuario, email: usuario.email }
        res.status(201).json(data);
    }
    catch(err) {
        var msg = '';
        try {
            msg = err.errors[0].message;
        }
        catch(e) {
            msg = err;
        }

        console.log(err);
        res.status(400).json(msg);
    }
}


module.exports = { createUsuario };