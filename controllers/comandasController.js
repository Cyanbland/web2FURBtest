const { getComanda, getComandas, getUsuarioFromComanda, associateUsuarioToComanda, registerComanda } = require('../models/comanda');
const { getUsuarioById } = require('../models/usuario');

const getAllComandas = async (req, res) => {
    try {
        const comandas = await getComandas();
        var usuariosComandas = [];

        for (let i = 0; i < comandas.length; i++) {
            console.log(comandas[i])
            let usuario = await getUsuarioFromComanda(comandas[i].dataValues.idComanda);
            console.log(usuario)
            let { idUsuario, nomeUsuario, telefoneUsuario } = usuario.dataValues;

            usuariosComandas.push({ idUsuario, nomeUsuario, telefoneUsuario });


        };
        
        console.log(usuariosComandas)
        res.status(200).json(usuariosComandas);
    }
    catch(err) {
        console.log(err)
        res.status(400).json(err);
    }
};

const getComandaById = async (req, res) => {
    const id = req.params.id;

    try {
        const comanda = getComanda(id);
        res.status(200).json({ comanda })
    }
    catch(err) {
        let msg = err.errors[0].message;
        console.log(err);
        res.status(400).json(msg);
    }
};

const createComanda = async (req, res) => {
    var produtos = [];
    var { idUsuario, nomeUsuario, telefoneUsuario, produtos } = req.body;

    var userValidationErrorMsg = '';

    try {
        const usuarioComanda = await getUsuarioById(idUsuario);

        //user already exists
        if (usuarioComanda) {
            if (usuarioComanda.nomeUsuario !== nomeUsuario || usuarioComanda.telefoneUsuario !== telefoneUsuario) {
                userValidationErrorMsg = 'Invalid user credentials';
            }
        }
        //user doesn´t exist
        else {
            userValidationErrorMsg = 'User is not registered';
        }
    
        if (userValidationErrorMsg !== '') {
            res.status(400).json({ error: userValidationErrorMsg });
        }

    }
    catch(err) {
        console.log(err);
    }
    

    const comanda = await registerComanda({ idUsuario, nomeUsuario, telefoneUsuario, produtos });
    await associateUsuarioToComanda(idUsuario, comanda.idComanda);

    const usuarioComanda = await getUsuarioFromComanda(comanda.idComanda);

    res
        .status(201)
        .json({ id: comanda.idComanda, idUsuario: usuarioComanda.idUsuario, nomeUsuario: usuarioComanda.nomeUsuario, telefoneUsuario: usuarioComanda.telefoneUsuario, produtos: produtos});
};

module.exports = { getComandaById, getAllComandas, createComanda };