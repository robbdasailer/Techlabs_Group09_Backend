var express = require("express");
var authRouter = require("./auth");
var userRouter = require("./user");
var restaurantRouter = require("./restaurant");

var app = express();

app.use("/auth/", authRouter);
app.use("/user/", userRouter);
app.use("/restaurant/", restaurantRouter);

module.exports = app;