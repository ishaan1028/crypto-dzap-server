const route = require("express").Router();
const cryptoService = require("../services/crypto.service");

// get all crypto and fiat list
route.get("/list", cryptoService.getAllCryptoAndFiat);

// convert crypto to fiat
route.get("/convert", cryptoService.cryptoToFiat);

module.exports = route;
