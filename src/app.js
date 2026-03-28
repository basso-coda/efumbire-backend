const express = require('express');
const app = express();
const cors = require("cors");

const dotenv = require('dotenv');
const fileUpload = require("express-fileupload");

const routesProvider = require('./routes/routesProvider');
// const paiementRouter = require('./routes/gestion_paiement/paiement_routes');

// Pour la documentation avec swagger/openapi
// const swaggerUi = require("swagger-ui-express");
const { swaggerUi, swaggerSpec } = require("./config/swaggers");
const initAssociations = require('./db/models/associations');



initAssociations();

dotenv.config()

app.use(cors({
  origin: "*"
}));

app.use(express.static(__dirname + "/../public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.use('/', paiementRouter)
app.use('/api', routesProvider);

app.use((req, res) => {
  res.status(404).json({
    message: "Ce lien n'existe pas dans le système",
    httpStatus: 404,
    data: null
  });
});


module.exports = app;