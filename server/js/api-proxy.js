"use strict";
exports.__esModule = true;
var express = require("express");
var cors = require("cors");
var http_proxy_middleware_1 = require("http-proxy-middleware");
var PORT = 8082;
var HOST = "localhost";
var API_BASE_URL = "https://dog.ceo/api";
var App = express();
App.use(cors());
App.options("*", cors());
App.use("/", http_proxy_middleware_1.createProxyMiddleware({
    target: API_BASE_URL,
    changeOrigin: true
}));
App.listen(PORT, HOST, function () {
    console.log("Running API proxy server on port " + PORT);
});
