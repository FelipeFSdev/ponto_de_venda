const express = require('express');
const verificarEmail = require('./filtros/duplicidade');
const { cadastrarUsuario, loginUsuario, editarUsuario, detalharUsuario } = require('./controladores/usuarios');
const listarCategorias = require('./controladores/categorias');
const validarCampos = require('./filtros/verificarCampos');
const verificaLogin = require('./filtros/verificaLogin');
const { cadastrarProduto, listarProdutos } = require('./controladores/produtos');

const rotas = express();

rotas.use(express.json());

rotas.get("/categoria", listarCategorias);
rotas.post("/usuario", validarCampos, verificarEmail, cadastrarUsuario);
rotas.post("/login", loginUsuario);

rotas.use(verificaLogin)

rotas.get("/usuario", detalharUsuario);
rotas.put("/usuario", validarCampos, editarUsuario);

rotas.post("/produto", cadastrarProduto);
rotas.put("/produto",) //editar produto
rotas.get("/produto", listarProdutos) //listar produtos + detalhar produto
rotas.delete("/produto",) //excluir produto
rotas.post("/cliente",) //cadastrar cliente
rotas.put("/cliente",) //editar cliente
rotas.get("/cliente",) //listar clientes + detalhar cliente

module.exports = rotas;