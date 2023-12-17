const knex = require("../servicos/conexaopg");

const validarCamposPedidos = async (req, res, next) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    if (!cliente_id) {
        return res.status(404).json({ mensagem: "É necessário informar o ID do cliente." });
    }
    if (!observacao) {
        return res.status(400).json({ mensagem: "É necessário informar a observação do pedido." })
    }
    for (const pedido_produto of pedido_produtos) {
        const { quantidade_produto, produto_id } = pedido_produto
        if (!produto_id) {
            return res.status(400).json({ mensagem: "É necessário informar o ID do produto." });
        }
        if (!quantidade_produto) {
            return res.status(400).json({ mensagem: "É necessário informar a quantidade do produto." });
        }
        if (quantidade_produto < 0) {
            return res.status(400).json({ mensagem: "Valor inválido. Insira um númerio maior que zero." })
        }
    }
    next();
};

const validarProdutos = async (req, res, next) => {
    const { pedido_produtos } = req.body;

    try {
        for (const pedido_produto of pedido_produtos) {
            const { quantidade_produto, produto_id } = pedido_produto

            const produtoPedido = await knex("produtos").where({ id: produto_id }).first();

            if (!produtoPedido) {
                return res.status(404).json({ mensagem: "Produto não encontrado." });
            }
            if (quantidade_produto > produtoPedido.quantidade_estoque) {
                return res.status(404).json({ mensagem: "Quantidade em estoque insuficiente para realizar o pedido." })
            }
        }

        next();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }



}

module.exports = {
    validarCamposPedidos,
    validarProdutos
};