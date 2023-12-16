const knex = require('../servicos/conexaopg');

const listarCategorias = async (req, res) => {

    try {
        const categorias = await knex("categorias").select("descricao");
        res.json(categorias);

    } catch (error) {
        res.status(400).json({ mensagem: error.message });
    }
};


module.exports = listarCategorias;