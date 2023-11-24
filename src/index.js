const express = require("express");
const rotas = require("./rotas");


const app = express();

app.use(rotas);
app.use(express.json());

app.listen(process.env.PORT)