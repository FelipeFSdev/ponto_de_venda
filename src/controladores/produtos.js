const knex = require('../conexao/conexaopg');

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    try {
        const categoria = await knex("categorias").where({ id: categoria_id }).first();
        if (!categoria) {
            return res.status(404).json("Categoria não encontrada.");
        }

        const produto = await knex("produtos").insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).returning("*");

        return res.status(201).json(produto[0]);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const editarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const { id } = req.params;

    try {
        const categoriaEncontrada = await knex("categorias").where({ id: categoria_id }).first();
        if (!categoriaEncontrada) {
            return res.status(404).json({ mensagem: "Categoria não encontrada." });
        }

        const produto = await knex("produtos")
            .update({ descricao, quantidade_estoque, valor, categoria_id })
            .where({ id }).returning('*');

        if (!produto[0]) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }

        return res.status(204).json()
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query;

    try {
        if (categoria_id) {
            const filtrarCategoria = await knex("produtos").where({ categoria_id });
            if (!filtrarCategoria[0]) {
                return res.status(404).json({ mensagem: "Categoria não encontrada." })
            }
            return res.status(200).json(filtrarCategoria);
        }
        const produtos = await knex("produtos");

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const detalharProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produto = await knex("produtos").where({ id }).first();
        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }
        return res.status(200).json(produto);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const deletarProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const deletar = await knex("produtos").delete().where({ id }).returning("*");
        if (!deletar[0]) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }
        return res.status(204).json();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

module.exports = {
    cadastrarProduto,
    editarProduto,
    listarProdutos,
    detalharProduto,
    deletarProduto
}