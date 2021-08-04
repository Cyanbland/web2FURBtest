const { registerProduto, getProdutos, getProduto } = require('../models/produto');

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

const getProdutoById = async (req, res) => {
    const id = req.params.id;

    var obj = {};

    try {
        const produto = await getProduto(id);

        obj = { id: produto.id, nome: produto.nome, preco: produto.preco };

        return res.status(200).json(obj);
    }
    catch(err) {
        let msg = 'Not found!';
        console.log(err);
        return res.status(404).json({ error: msg });
    }
}

module.exports = { createProduto, getAllProdutos, getProdutoById };

