"use strict";
exports.__esModule = true;
var express = require("express");
var cors = require("cors");
var PORT = 8082;
var HOST = "localhost";
var API_BASE_URL = "https://dog.ceo/api";
var App = express();
App.use(cors());
App.options("*", cors());
App.get("*", function (req, res) {
    return req.body.json().then(function (value) {
        res.send(value);
    });
});
App.listen(PORT, HOST, function () {
    console.log("Running API proxy server on port " + PORT);
});
