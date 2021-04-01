import * as express from "express";
import * as cors from "cors";

const PORT = 8082;
const HOST = "localhost";
const API_BASE_URL = "https://dog.ceo/api"

const App = express();

App.use(cors());

App.options("*", cors());

App.get("*", (req, res) =>
  req.body.json().then((value: any) => {
    res.send(value);
  })
)

App.listen(PORT, HOST, () => {
  console.log(`Running API proxy server on port ${PORT}`);
});

