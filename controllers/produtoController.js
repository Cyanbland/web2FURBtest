const { registerProduto, getProdutos } = require('../models/produto');

const createProduto = async (req, res) => {
    var { nome, preco } = req.body;

    try {
        const produto = await registerProduto({ nome, preco });

        res.status(301).json({ id: produto.id, nome: produto.nome, preco: produto.preco});
    }
    catch (err) {
        let msg = err.errors[0].message;
        console.log(err);
        res.status(400).json(msg);
    }
};

const getAllProdutos = async (req, res) => {
    try {
        const produtos = await getProdutos();

        res.status(200).json(produtos);
    }
    catch (err) {
        let msg = err.errors[0].message;
        console.log(err);
        res.status(400).json(msg);
    }

};

module.exports = { createProduto, getAllProdutos };

