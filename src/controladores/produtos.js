const knex = require('../servicos/conexaopg');
const { upload, exclusao } = require('../servicos/uploads');

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const { file } = req;

    try {
        const categoria = await knex("categorias").where({ id: categoria_id }).first();
        if (!categoria) {
            return res.status(404).json("Categoria não encontrada.");
        }

        let imagem = null;

        if (file) {
            imagem = await upload(file.originalname, file.buffer, file.mimetype)
        }

        const produto = await knex("produtos").insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem: imagem ? imagem.url : imagem
        }).returning("*");

        return res.status(201).json(produto[0]);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const editarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const { id } = req.params;
    const { file } = req;

    try {
        const categoriaEncontrada = await knex("categorias").where({ id: categoria_id }).first();
        if (!categoriaEncontrada) {
            return res.status(404).json({ mensagem: "Categoria não encontrada." });
        }

        if (file) {
            imagem = await upload(file.originalname, file.buffer, file.mimetype)

            await knex("produtos")
                .update({ produto_imagem: imagem.url })
                .where({ id }).returning('*');
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
        const pedidoProduto = await knex("pedido_produtos").where({ produto_id: id }).first();
        if (pedidoProduto) {
            return res.status(400).json({
                mensagem: "O produto não pode ser excluído pois está vinculado a um pedido"
            });
        }
        const deletar = await knex("produtos").delete().where({ id }).returning("*");
        if (!deletar[0]) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }

        if (deletar[0].produto_imagem) {
            const formatarPath = deletar[0].produto_imagem.split("/")
            const imagemPath = formatarPath.reverse()[0]
            await exclusao(imagemPath)
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