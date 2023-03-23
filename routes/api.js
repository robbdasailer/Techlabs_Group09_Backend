var express = require("express");
var authRouter = require("./auth");
var userRouter = require("./user");
var restaurantRouter = require("./restaurant");
// var appointmentRouter = require(".appointment");
var app = express();

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    failOnErrors: true,
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Tafel Route API',
        version: '1.0.0',
      },
    },
    apis: ['./routes/*.js'], // files containing annotations as above
  };

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth/", authRouter);
app.use("/user/", userRouter);
app.use("/restaurant/", restaurantRouter);
// app.use("/appointment", appointmentRouter);

module.exports = app;