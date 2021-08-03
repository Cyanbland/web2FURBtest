const { Router } = require('express');
const routesFurb = require('./routesFurb');

const routes = Router();

routes.use('/RestAPIFurb', routesFurb);




module.exports = routes;