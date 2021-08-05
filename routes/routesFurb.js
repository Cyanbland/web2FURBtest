const { Router } = require('express');
const comandasController = require('../controllers/comandasController');
const authController = require('../controllers/authController');
const produtoController = require('../controllers/produtoController');

const routes = Router();

routes.get('/produtos', produtoController.getAllProdutos);
routes.get('/produtos/:id', produtoController.getProdutoById);
routes.post('/produtos', produtoController.createProduto);

routes.get('/comandas', comandasController.getAllComandas);
routes.get('/comandas/:id', comandasController.getComandaById);
routes.post('/comandas', comandasController.createComanda);
routes.delete('/comandas/:id', comandasController.deleteComanda);
routes.put('/comandas/:id', comandasController.updateComanda);

routes.post('/registrar', authController.createUsuario);



module.exports = routes;