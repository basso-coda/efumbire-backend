const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require('swagger-ui-express');
const path = require("path")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Gestion Agricole",
      version: "1.0.0",
      description: "Documentation API pour le système agricole",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    
  },
  apis: [path.join(__dirname, "../routes/**/*.js")], // fichiers où sont tes endpoints
};
const swaggerSpec = swaggerJsdoc(options);

console.log(swaggerSpec.paths);

module.exports = { swaggerUi, swaggerSpec };