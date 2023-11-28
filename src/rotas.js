const express = require('express');
const verificarEmail = require('./filtros/duplicidade');
const { cadastrarUsuario, loginUsuario } = require('./controladores/usuarios');
const listarCategorias = require('./controladores/categorias');
const validarCampos = require('./filtros/verificarCampos');
const verificarItensLogin = require('./filtros/verificarItensLogin');
const rotas = express();

rotas.use(express.json());

rotas.get("/categoria", listarCategorias);
rotas.post("/usuario", validarCampos, verificarEmail, cadastrarUsuario);
rotas.post("/login", verificarItensLogin ,loginUsuario);
rotas.get("/usuario",);
rotas.put("/usuario",);

module.exports = rotas;