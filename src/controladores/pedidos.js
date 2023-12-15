const transport = require("../servicos/nodemailer");
const knex = require("../servicos/conexaopg");
const { cliente } = require("../filtros/validarCadastroPedidos")

const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;
    const { quantidade_produto, produto_id } = pedido_produtos[0];
    const { usuario } = req;

    try {
        const cliente = await knex("clientes").where({ id: cliente_id }).first();
        const valorProduto = await knex("produtos").where({ id: produto_id }).select("valor").first();
        const valor_total = valorProduto.valor * quantidade_produto;

        if (!cliente) {
            return res.status(404).json("Cliente não encontrado.");
        }

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
            from: `${usuario.nome} < ${usuario.email}>`,
            to: `${cliente.nome} < ${cliente.email}>`,
            subject: "Pedido efetuado com sucesso.",
            text:
                `Olá, ${cliente.nome}. Me chamo ${usuario.nome} e venho, através desse email,
            informar que seu pedido já foi recebido pela nossa equipe. Estamos fazendo a separação
            dos produtos e enviaremos seu pedido o mais breve possível. Obrigado pela preferência! `,
        });


        return res.status(201).json(novoPedido);
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
};

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {
        if (cliente_id) {
            const pedido = await knex("pedidos").where({ cliente_id })
            if (!pedido[0]) {
                return res.status(404).json({ mensagem: "Pedido não encontrado." });
            }
            const pedido_produtos = await knex("pedido_produtos").where({ pedido_id: pedido[0].id })
            return res.status(200).json({ pedido, pedido_produtos })
        }

        const pedidos = await knex("pedidos")
        const pedido_produtos = await knex("pedido_produtos")

        // const query = await knex('pedidos')
        //     .select('pedidos.id', 'pedidos.valor_total', 'pedidos.observacao', 'pedidos.cliente_id')
        //     .leftJoin('pedido_produtos', 'pedidos.id', 'pedido_produtos.pedido_id');
        // console.log(query)

        // const pedidos = query;

        // const pedidoFormatado = pedidos.map((pedido) => ({
        //     pedido: {
        //         id: pedido.id,
        //         valor_total: pedido.valor_total,
        //         observacao: pedido.observacao,
        //         cliente_id: pedido.cliente_id,
        //     },
        //     pedido_produtos: pedidos
        //         .filter((p) => p.id === pedido.id)
        //         .map((p) => ({
        //             id: p.pedido_produtos.id,
        //             quantidade_produto: p.pedido_produtos.quantidade_produto,
        //             valor_produto: p.pedido_produtos.valor_produto,
        //             pedido_id: p.pedido_produtos.pedido_id,
        //             produto_id: p.pedido_produtos.produto_id,
        //         })),
        // }));
        // console.log(pedidoFormatado)

        res.status(200).json({ pedidos, pedido_produtos });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    cadastrarPedido,
    listarPedidos,
}