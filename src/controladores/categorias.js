const knex = require('../conexao/conexaopg');

const listarCategorias = async (req, res) => {

    try {
        const categorias = await knex("categorias").select("descricao");
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

module.exports = listarCategorias;