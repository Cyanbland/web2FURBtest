const { Router } = require('express');
const comandasController = require('../controllers/comandasController');
const authController = require('../controllers/authController');

const routes = Router();

routes.get('/comandas', comandasController.getAllComandas);
routes.get('/comandas/:id', comandasController.getComandaById);
routes.post('/comandas', comandasController.createComanda)
routes.post('/registrar', authController.createUsuario);



module.exports = routes;