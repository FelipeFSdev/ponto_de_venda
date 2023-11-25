const express = require('express');
const verificarEmail = require('./filtros/duplicidade');
const { cadastrarUsuario } = require('./controladores/usuarios');
const listarCategorias = require('./controladores/categorias');
const rotas = express();

rotas.use(express.json());

rotas.get("/categoria", listarCategorias);
rotas.post("/usuario", verificarEmail,cadastrarUsuario);
rotas.post("/login",);
rotas.get("/usuario",);
rotas.put("/usuario",);

module.exports = rotas;