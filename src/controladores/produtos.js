const knex = require('../conexao/conexaopg');

const cadastrarProduto = async (req, res) => {

    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    if (!descricao) {
        return res.status(404).json('O campo descricao é obrigatório');
    }

    if (!quantidade_estoque) {
        return res.status(404).json('O campo quantidade_estoque é obrigatório');
    }

    if (!valor) {
        return res.status(404).json('O campo valor é obrigatório');
    }

    if (!categoria_id) {
        return res.status(404).json('O campo categoria_id obrigatório');
    }

    try {
        const categoria = await knex('categoria').where({
            id:categoria_id
        }).first()

        if(!categoria){
            return res.status(404).json('categoria não encontrada')
        }


        const produto = await knex('produtos').insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).returning('*')

        if (!produto[0]) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        return res.status(200).json(produto[0]);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}



module.exports = {
    cadastrarProduto
}