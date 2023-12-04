const express = require('express');
const { cadastrarUsuario, loginUsuario, editarUsuario, detalharUsuario } = require('./controladores/usuarios');
const { editarProduto } = require('./controladores/produtos');
const listarCategorias = require('./controladores/categorias');
const { editarCliente } = require('./controladores/clientes');
const { cadastrarProduto } = require('./controladores/produtos');
const verificarEmail = require('./filtros/duplicidade');
const validarCampos = require('./filtros/verificarCampos');
const verificaLogin = require('./filtros/verificaLogin');
const validarCamposProdutos = require('./filtros/camposProdutos');
const validarCliente = require('./filtros/camposCliente');

const rotas = express();

rotas.use(express.json());

rotas.get("/categoria", listarCategorias);
rotas.post("/usuario", validarCampos, verificarEmail, cadastrarUsuario);
rotas.post("/login", loginUsuario);

rotas.use(verificaLogin)

rotas.get("/usuario", detalharUsuario);
rotas.put("/usuario", validarCampos, editarUsuario);

rotas.post("/produto", validarCamposProdutos, cadastrarProduto);
rotas.put("/produto/:id", validarCamposProdutos, editarProduto)
rotas.get("/produto",) //listar produtos 
rotas.get("/produto/:id",) //detalhar produto
rotas.delete("/produto/:id",) //excluir produto

rotas.post("/cliente",) //cadastrar cliente
rotas.put("/cliente/:id", validarCliente, editarCliente) //editar cliente
rotas.get("/cliente",) //listar clientes  
rotas.get("/cliente/:id",) //detalhar cliente

module.exports = rotas;