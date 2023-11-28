const express = require('express');
const verificarEmail = require('./filtros/duplicidade');
const { cadastrarUsuario } = require('./controladores/usuarios');
const listarCategorias = require('./controladores/categorias');
const validarCampos = require('./filtros/verificarCampos');
const rotas = express();

rotas.use(express.json());

rotas.get("/categoria", listarCategorias);
rotas.post("/usuario", validarCampos, verificarEmail, cadastrarUsuario);
rotas.post("/login",);
rotas.get("/usuario",);
rotas.put("/usuario", validarCampos, verificarEmail, cadastrarUsuario);

module.exports = rotas;