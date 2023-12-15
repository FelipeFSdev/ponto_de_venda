const transport = require("../email");
const knex = require('../conexao/conexaopg');

const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;
    const { quantidade_produto, produto_id } = pedido_produtos[0];
    try {
        const cliente = await knex("clientes").where({ id: cliente_id }).first();
        if (!cliente) {
            return res.status(404).json("Cliente não encontrado.");
        }
        const produtoPedido = await knex("produtos").where({ id: produto_id }).first();
        if (quantidade_produto > produtoPedido.quantidade_estoque) {
            return res.status(404).json("Quantidade insuficiente para realizar o pedido.")
        }
        if (!produtoPedido) {
            return res.status(404).json("Produto não encontrado.");
        }

        const valorProduto = await knex("produtos").where({ id: produto_id }).select("valor").first();
        const valor_total = valorProduto.valor * quantidade_produto;

        const estoqueProduto = await knex("produtos")
            .where({ id: produto_id })
            .select("quantidade_estoque")
            .first();
        const estoqueFinal = estoqueProduto.quantidade_estoque - quantidade_produto;

        await knex("produtos").where({ id: produto_id }).update({
            quantidade_estoque: estoqueFinal
        })

        const novoPedido = await knex("pedidos")
            .insert({ cliente_id, observacao, valor_total })
            .returning('*');

        await knex("pedido_produtos").insert({
            pedido_id: novoPedido[0].id,
            produto_id,
            quantidade_produto,
            valor_produto: valorProduto.valor
        });

                
        transport.sendMail({
            from: `Usuario PDV < ${req.usuario.email}>`, 
            to: `${cliente.nome} < ${cliente.email}>`, 
            subject: "Pedido", 
            text: "Pedido efetuado com sucesso", 
    
        })

        return res.status(201).json(novoPedido);
    }
    catch (error) {
        return res.status(400).json(error.message)
    }
};

module.exports = {
    cadastrarPedido
}