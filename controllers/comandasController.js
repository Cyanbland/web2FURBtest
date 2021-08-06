const { getComanda, getComandas, getUsuarioFromComanda, getAssociatedProdutos, associateUsuarioToComanda, associateProdutoToComanda, registerComanda, destroyComandaById, saveComandaChangesById, checkIfProdutoInComanda } = require('../models/comanda');
const { getProduto } = require('../models/produto');
const { getUsuario } = require('../models/usuario');

const getAllComandas = async (req, res) => {
    //Shouldn´t return the associated products
    try {
        const comandas = await getComandas();
        var usuariosComandas = [];

        for (let i = 0; i < comandas.length; i++) {
            let usuario = await getUsuarioFromComanda(comandas[i].dataValues.idComanda);

            let { idUsuario, nomeUsuario, telefoneUsuario } = usuario.dataValues;

            usuariosComandas.push({ idUsuario, nomeUsuario, telefoneUsuario });
        };
        
        return res.status(200).json(usuariosComandas);
    }
    catch(err) {
        console.log(err)
        return res.status(400).json(err);
    }
};

const getComandaById = async (req, res) => {
    const idParam = req.params.id;

    const arr = [];
    var obj = {};


    try {
        const comanda = await getComanda(idParam);
        const usuarioComanda = await getUsuarioFromComanda(comanda.dataValues.idComanda);

        const produtos = await getAssociatedProdutos(comanda.idComanda);

        var objects = produtos.map( (produto) => {
            let aux = {};
            let { id, nome, preco } = produto;
            aux['id'] = id;
            aux['nome'] = nome;
            aux['preco'] = preco;
            
            return aux;
        });

        arr.push(objects);

        obj = { idUsuario: usuarioComanda.idUsuario, nomeUsuario: usuarioComanda.nomeUsuario, telefoneUsuario: usuarioComanda.telefoneUsuario, produtos: arr[0] }

        return res.status(200).json(obj);
    }
    catch(err) {
        let msg = 'Not found!';
        console.log(err);
        return res.status(404).json({ error: msg });
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
                return res.status(400).json({ error: userValidationErrorMsg });
            }
        }
        //user doesn´t exist
        else {
            userValidationErrorMsg = 'User is not registered';
            return res.status(400).json({ error: userValidationErrorMsg });
        }

        for (let i = 0; i < produtos.length; i++) {
            let id = produtos[i].id;

            const produto = await getProduto(id);

            //product exists
            if (produto) {
                if (produto.nome !== produtos[i].nome || produto.preco !== produtos[i].preco) {
                    productValidationErrorMsg = 'Invalid product data informed';
                    return res.status(400).json({ error: productValidationErrorMsg });
                }
            }
            //product doesn´t exist
            else {
                productValidationErrorMsg = 'Product is not registered';
                return res.status(400).json({ error: productValidationErrorMsg });
            }
        }

    }
    catch(err) {
        console.log(err);
    }
    

    const comanda = await registerComanda({ idUsuario, nomeUsuario, telefoneUsuario, produtos });
    await associateUsuarioToComanda(idUsuario, comanda.idComanda);

    for (let i = 0; i < produtos.length; i++) {
        await associateProdutoToComanda(comanda.idComanda, produtos[i].id);
    }

    const usuarioComanda = await getUsuarioFromComanda(comanda.idComanda);

    return res
        .status(201)
        .json({ id: comanda.idComanda, idUsuario: usuarioComanda.idUsuario, nomeUsuario: usuarioComanda.nomeUsuario, telefoneUsuario: usuarioComanda.telefoneUsuario, produtos: produtos});
};

const updateComanda = async (req, res) => {
    const idParam = req.params.id;
    var { idUsuario, nomeUsuario, telefoneUsuario, produtos } = req.body;

    const comanda = await getComanda(idParam);

    if (!comanda) {
        return res.status(404).json({ error: 'Comanda not found!' })
    }

    var userValidationErrorMsg = '';
    var productValidationErrorMsg = '';

    try {
        //USER VALIDATION

        //blocks direct user data updates
        if (nomeUsuario || telefoneUsuario) {
            return res.status(400).json({ error: 'Changing user data is not allowed. Update the user id instead.' })
        }
        //checks if user is to be changed
        else if (idUsuario) {
            const usuarioComanda = await getUsuario(idUsuario);

            //user doesn´t exist
            if (!usuarioComanda) {
                userValidationErrorMsg = 'User is not registered';
                return res.status(400).json({ error: userValidationErrorMsg });
            }

            await associateUsuarioToComanda(idUsuario, comanda.idComanda);
        }

        //PRODUCTS VALIDATION

        var productIds = [];

        if (produtos) {
            for (let i = 0; i < produtos.length; i++) {
                let id = produtos[i].id;
    
                let produto = await getProduto(id);
    
                //product exists
                if (produto) {
                    let produtoInComanda = await checkIfProdutoInComanda(produto.id, comanda.idComanda);
                    //produto is not already in Comanda
                    if (!produtoInComanda || productIds.includes(produto.id)) {
                        productValidationErrorMsg = 'New products should only be added in POST route';
                        return res.status(400).json({ error: productValidationErrorMsg });
                    }
                    //wrong product data informed
                    else if (produto.nome !== produtos[i].nome || produto.preco !== produtos[i].preco) {
                        productValidationErrorMsg = 'Invalid product data informed';
                        return res.status(400).json({ error: productValidationErrorMsg });
                    }

                }
                //product doesn´t exist
                else {
                    productValidationErrorMsg = 'Product is not registered';
                    return res.status(400).json({ error: productValidationErrorMsg });
                }
                productIds.push(produto.id);
                await associateProdutoToComanda(comanda.idComanda, produto.id)
            }
        }
    }
    catch(err) {
        console.log(err);
    }
    
    await saveComandaChangesById(comanda.idComanda);

    const usuarioComanda = await getUsuarioFromComanda(comanda.idComanda);
    

    return res
        .status(200)
        .json({ id: comanda.idComanda, idUsuario: usuarioComanda.idUsuario, nomeUsuario: usuarioComanda.nomeUsuario, telefoneUsuario: usuarioComanda.telefoneUsuario, produtos: produtos});
};

const deleteComanda = async (req, res) => {
    const idParam = req.params.id;

    var returnedObj = {};
    var msg = '';

    try {
        const comanda = await getComanda(idParam);
        if (comanda) {
            await destroyComandaById(idParam);

            msg = {text: 'comanda removida'};
            returnedObj = { success: msg };
            return res.status(200).json(returnedObj);
        }
        else {
            msg = {text: 'comanda não encontrada'};
            return res.status(404).json({ error: msg });
        }
    }
    catch(err) {
        let msg = 'Not found!';
        console.log(err);
        return res.status(404).json({ error: msg });
    }
};

module.exports = { getComandaById, getAllComandas, createComanda, deleteComanda, updateComanda };