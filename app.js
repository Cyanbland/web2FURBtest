const express = require('express');
const routes = require('./routes');
const db = require('./database/index');
const dotenv = require('dotenv');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");



dotenv.config();

const app = express();
const PORT = 8080;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      version: "1.0.0",
      title: "Comanda API",
      description: "API developed as part of the FURB Web II test",
      contact: {
        name: "Paulo Rubens de Moraes Leme Júnior"
      },
      servers: [`http://localhost:${PORT}`]
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [__filename, `${__dirname}/routes/*.js`]
};

app.use(express.json());
app.use(routes);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.'});
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
