const express = require("express");
const rotas = require("./rotas");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(rotas);
app.use(cors());

app.listen(process.env.PORT);