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

module.exports = { editarProduto }