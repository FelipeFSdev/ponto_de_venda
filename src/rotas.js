const express = require('express');
const { cadastrarUsuario, loginUsuario, editarUsuario, detalharUsuario } = require('./controladores/usuarios');
const { editarProduto, detalharProduto, deletarProduto, cadastrarProduto, listarProdutos } = require('./controladores/produtos');
const listarCategorias = require('./controladores/categorias');
const { editarCliente, detalharCliente, listarClientes, cadastrarCliente } = require('./controladores/clientes');
const { verificarEmail, verificarCpf } = require('./filtros/duplicidade');
const validarCampos = require('./filtros/verificarCampos');
const verificaLogin = require('./filtros/verificaLogin');
const validarCamposProdutos = require('./filtros/camposProdutos');
const validarCliente = require('./filtros/camposCliente');

const multer = require('./servicos/multer');
const { listarPedidos, cadastrarPedido } = require('./controladores/pedidos');
const { validarCamposPedidos, validarProdutos } = require('./filtros/validarCadastroPedidos');

const rotas = express();

rotas.use(express.json());

rotas.get("/categoria", listarCategorias);
rotas.post("/usuario", validarCampos, verificarEmail, cadastrarUsuario);
rotas.post("/login", loginUsuario);

rotas.use(verificaLogin);

rotas.get("/usuario", detalharUsuario);
rotas.put("/usuario", validarCampos, editarUsuario);

rotas.post("/produto", multer.single("imagem"), validarCamposProdutos, cadastrarProduto);
rotas.put("/produto/:id", multer.single("imagem"), validarCamposProdutos, editarProduto);
rotas.get("/produto", listarProdutos);
rotas.get("/produto/:id", detalharProduto);
rotas.delete("/produto/:id", deletarProduto);

rotas.post("/cliente", validarCliente, verificarEmail, verificarCpf, cadastrarCliente);
rotas.put("/cliente/:id", validarCliente, verificarCpf, editarCliente);
rotas.get("/cliente", listarClientes);
rotas.get("/cliente/:id", detalharCliente);

rotas.post("/pedido", validarCamposPedidos, validarProdutos, cadastrarPedido);
rotas.get("/pedido", listarPedidos);

module.exports = rotas;