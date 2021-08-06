const { Router } = require('express');
const comandasController = require('../controllers/comandasController');
const authController = require('../controllers/authController');
const produtoController = require('../controllers/produtoController');
const { checkIfAdmin } = require('../middlewares/authMiddleware');

const routes = Router();

//FURBRoutes
/** 
*@swagger
*
* /RestAPIFurb/produtos:
*   get:
*       description: Lists all the registered products
*       produces: application/json
*       responses:
*           200:
*               description: Returns an array containing { id, nome, preco } from each registered product
*           400:
*               description: Returns the error message
*/
routes.get('/produtos', produtoController.getAllProdutos);

/** 
*@swagger
*
* /RestAPIFurb/produtos/:id :
*   get:
*       description: Shows the data from a specific product
*       produces: application/json
*       parameters: 
*           - name: id
*             in: path
*             required: true
*             type: integer
*             description: productId
*       responses:
*           200:
*               description: Returns an array containing { id, nome, preco } from a specific product
*           404:
*               description: Returns the 'Not found!' error message
*/
routes.get('/produtos/:id', produtoController.getProdutoById);

/** 
*@swagger
*
* /RestAPIFurb/produtos:
*   post:
*       description: Registers a new product
*       produces: application/json
*       parameters: 
*           - name: nome
*             in: formData
*             required: true
*             type: string
*             description: product´s name
*           - name: preco
*             in: formData
*             required: true
*             type: string
*             description: product´s price
*       responses:
*           201:
*               description: Returns { id, nome, preco } from the registered product
*           400:
*               description: Returns the validation error message
*/
routes.post('/produtos', produtoController.createProduto);

/** 
*@swagger
*
* /RestAPIFurb/comandas:
*   get:
*       description: Shows the data from all registered comandas (Without products)
*       produces: application/json
*       responses:
*           200:
*               description: Returns an array containing { idUsuario, nomeUsuario, telefoneUsuario } from each comanda´s associated user
*           400:
*               description: Returns the error message
*/
routes.get('/comandas', comandasController.getAllComandas);

/** 
*@swagger
*
* /RestAPIFurb/comandas/:id :
*   get:
*       description: Shows the data from a specific comanda
*       produces: application/json
*       parameters: 
*           - name: id
*             in: path
*             required: true
*             type: integer
*             description: comandaId
*       responses:
*           200:
*               description: Returns { idUsuario, nomeUsuario, telefoneUsuario, [products] } from a specific comanda
*           404:
*               description: Returns the 'Not found!' error message
*/
routes.get('/comandas/:id', comandasController.getComandaById);

/** 
*@swagger
*
* /RestAPIFurb/comandas:
*   post:
*       description: Registers a new comanda
*       produces: application/json
*       parameters: 
*           - name: idUsuario
*             in: formData
*             required: true
*             type: UUID
*             description: user´s id
*           - name: nomeUsuario
*             in: formData
*             required: true
*             type: string
*             description: user´s name
*           - name: telefoneUsuario
*             in: formData
*             required: true
*             type: string
*             description: user´s phone number
*           - name: produtos
*             in: formData
*             required: true
*             type: array[object]
*             description: object array containing the { id, nome, preco} from each registered product to be included in the comanda
*       responses:
*           201:
*               description: Returns { id, idUsuario, nomeUsuario, telefoneUsuario, [produtos] } from the registered comanda
*           400:
*               description: Returns the validation error message
*/
routes.post('/comandas', comandasController.createComanda);

/** 
*@swagger
*
* /RestAPIFurb/comandas/:id :
*   delete:
*       description: Deletes a specific comanda
*       produces: application/json
*       parameters: 
*           - name: id
*             in: path
*             required: true
*             type: integer
*             description: comandaId
*       responses:
*           200:
*               description: Returns a success message
*           404:
*               description: Returns the 'Not found!' error message
*/
routes.delete('/comandas/:id', comandasController.deleteComanda);

/** 
*@swagger
*
* /RestAPIFurb/comandas/:id :
*   put:
*       description: Updates the data of an existing comanda (Can´t include new products)
*       produces: application/json
*       security:
*           - bearerAuth: []       
*       parameters: 
*           - name: idUsuario
*             in: formData
*             required: false
*             type: UUID
*             description: user´s id
*           - name: produtos
*             in: formData
*             required: false
*             type: array[object]
*             description: object array containing the { id, nome, preco} from each registered product to be updated in the comanda
*       responses:
*           201:
*               description: Returns { id, idUsuario, nomeUsuario, telefoneUsuario, [produtos] } from the registered comanda
*           400:
*               description: Returns the validation error message
*/
routes.put('/comandas/:id', checkIfAdmin, comandasController.updateComanda);

/** 
*@swagger
*
* /RestAPIFurb/registrar:
*   post:
*       description: Registers a new user
*       produces: application/json
*       parameters: 
*           - name: nomeUsuario
*             in: formData
*             required: true
*             type: string
*             description: user´s name
*           - name: telefoneUsuario
*             in: formData
*             required: true
*             type: string
*             description: user´s phone number
*           - name: email
*             in: formData
*             required: true
*             type: string
*             description: user´s email address
*           - name: senha
*             in: formData
*             required: true
*             type: string
*             description: user´s password
*       responses:
*           201:
*               description: Returns a JWT cookie and a data object = { idUsuario, nomeUsuario, telefoneUsuario, email } from the registered user
*           400:
*               description: Returns the validation error message
*/
routes.post('/registrar', authController.createUsuario);

/** 
*@swagger
*
* /RestAPIFurb/login:
*   post:
*       description: Logins an existing user
*       produces: application/json
*       parameters: 
*           - name: email
*             in: formData
*             required: true
*             type: string
*             description: user´s email address
*           - name: senha
*             in: formData
*             required: true
*             type: string
*             description: user´s password
*       responses:
*           201:
*               description: Returns a JWT cookie and a data object = { idUsuario, nomeUsuario, telefoneUsuario, email } from an already registered user if login is successful
*           400:
*               description: Returns the validation error message
*/
routes.post('/login', authController.login);

module.exports = routes;