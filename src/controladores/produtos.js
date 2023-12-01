const knex = require('../conexao/conexaopg');

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

        return res.status(204).send()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const detalharProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produto = await knex("produtos").where({ id }).first()
        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado." })
        }
        return res.status(200).json(produto);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }

}
const deletarProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const deletar = await knex("produtos").delete().where({ id }).returning("*");
        if (!deletar[0]) {
            return res.status(404).json({ mensagem: "Produto não encontrado" });
        }
        return res.status(204).json();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
}

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    try {
        const categoria = await knex('categorias').where({ id: categoria_id }).first()

        if (!categoria) {
            return res.status(404).json('Categoria não encontrada')
        }

        const produto = await knex('produtos').insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).returning(["descricao", "valor"]);

        return res.status(201).json(produto[0]);

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

module.exports = {
    editarProduto,
    detalharProduto,
    deletarProduto,
    cadastrarProduto,
}

