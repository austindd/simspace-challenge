import * as express from "express";
import * as cors from "cors";
import {createProxyMiddleware} from "http-proxy-middleware";

const PORT = 8082;
const HOST = "localhost";
const API_BASE_URL = "https://dog.ceo/api"

const App = express();

App.use(cors());

App.options("*", cors());

App.use("/", createProxyMiddleware({
  target: API_BASE_URL,
  changeOrigin: true,
}));

App.listen(PORT, HOST, () => {
  console.log(`Running API proxy server on port ${PORT}`);
});

