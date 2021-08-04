const { getComanda, getComandas, getUsuarioFromComanda, getAssociatedProdutos, associateUsuarioToComanda, associateProdutoToComanda, registerComanda } = require('../models/comanda');
const { getProduto } = require('../models/produto');
const { getUsuario } = require('../models/usuario');

const getAllComandas = async (req, res) => {
    try {
        const comandas = await getComandas();
        var usuariosComandas = [];

        for (let i = 0; i < comandas.length; i++) {
            let usuario = await getUsuarioFromComanda(comandas[i].dataValues.idComanda);
            let { idUsuario, nomeUsuario, telefoneUsuario } = usuario.dataValues;

            usuariosComandas.push({ idUsuario, nomeUsuario, telefoneUsuario });
        };
        
        res.status(200).json(usuariosComandas);
    }
    catch(err) {
        console.log(err)
        res.status(400).json(err);
    }
};

const getComandaById = async (req, res) => {
    const idParam = req.params.id;

    var obj = {};
    var aux = {};

    try {
        const comanda = await getComanda(idParam);
        const usuarioComanda = await getUsuarioFromComanda(comanda.dataValues.idComanda);

        const produtos = await getAssociatedProdutos(comanda.idComanda);

        for (let i = 0; i < produtos.length; i++) {
            let buffer = produtos[i];
            let { id, nome, preco } = buffer;

            aux = {...aux, id, nome, preco};
            console.log(aux)
            //ARRUMAR AQUI
        }

        console.log(await getAssociatedProdutos(comanda.idComanda))

        obj = { idUsuario: usuarioComanda.idUsuario, nomeUsuario: usuarioComanda.nomeUsuario, telefoneUsuario: usuarioComanda.telefoneUsuario, produtos: [aux] }

        res.status(200).json(obj);
    }
    catch(err) {
        let msg = 'Not found!';
        console.log(err);
        res.status(404).json({ error: msg });
    }
};

const createComanda = async (req, res) => {
    var produtos = [];
    var { idUsuario, nomeUsuario, telefoneUsuario, produtos } = req.body;


    var userValidationErrorMsg = '';
    var productValidationErrorMsg = '';

    try {
        const usuarioComanda = await getUsuario(idUsuario);

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
            return res.status(400).json({ error: userValidationErrorMsg });
        }


        for (let i = 0; i < produtos.length; i++) {
            let id = produtos[i].id;

            const produto = await getProduto(id);

            //product exists
            if (produto) {
                if (produto.nome !== produtos[i].nome || produto.preco !== produtos[i].preco) {
                    productValidationErrorMsg = 'Invalid product credentials';
                }
            }
            //product doesn´t exist
            else {
                productValidationErrorMsg = 'Product is not registered';
            }
        }

        if (productValidationErrorMsg !== '') {
            return res.status(400).json({ error: productValidationErrorMsg });
        }

    }
    catch(err) {
        console.log(err);
    }
    

    const comanda = await registerComanda({ idUsuario, nomeUsuario, telefoneUsuario, produtos });
    await associateUsuarioToComanda(idUsuario, comanda.idComanda);

    for (let i = 0; i < produtos.length; i++) {
        console.log(produtos[i])
        await associateProdutoToComanda(comanda.idComanda, produtos[i].id);
    }

    const usuarioComanda = await getUsuarioFromComanda(comanda.idComanda);

    res
        .status(201)
        .json({ id: comanda.idComanda, idUsuario: usuarioComanda.idUsuario, nomeUsuario: usuarioComanda.nomeUsuario, telefoneUsuario: usuarioComanda.telefoneUsuario, produtos: produtos});
};

module.exports = { getComandaById, getAllComandas, createComanda };