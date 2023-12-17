const transport = require("../servicos/nodemailer");
const knex = require("../servicos/conexaopg");

const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;
    const { usuario } = req;

    try {
        const cliente = await knex("clientes").where({ id: cliente_id }).first();

        if (!cliente) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }

        let valor_total = 0;
        const produtosDoPedido = [];

        for (const pedido_produto of pedido_produtos) {
            const { quantidade_produto, produto_id } = pedido_produto;

            const valorProduto = await knex("produtos").where({ id: produto_id }).select("valor").first();
            const valor_produto = valorProduto.valor * quantidade_produto;
            valor_total += valor_produto;

            const estoqueProduto = await knex("produtos")
                .where({ id: produto_id })
                .select("quantidade_estoque")
                .first();
            const estoqueFinal = estoqueProduto.quantidade_estoque - quantidade_produto;

            await knex("produtos").where({ id: produto_id }).update({
                quantidade_estoque: estoqueFinal
            });

            produtosDoPedido.push({
                produto_id,
                quantidade_produto,
                valor_produto
            });
        }

        const novoPedido = await knex("pedidos")
            .insert({ cliente_id, observacao, valor_total })
            .returning('*');

        for (const produtoDoPedido of produtosDoPedido) {
            produtoDoPedido.pedido_id = novoPedido[0].id;
        }

        await knex("pedido_produtos").insert(produtosDoPedido);

        transport.sendMail({
            from: `${usuario.nome} <${usuario.email}>`,
            to: `${cliente.nome} <${cliente.email}>`,
            subject: "Pedido efetuado com sucesso.",
            text: `Olá, ${cliente.nome}. Me chamo ${usuario.nome} e venho, através desse email,
                informar que seu pedido já foi recebido pela nossa equipe. Estamos fazendo a separação
                dos produtos e enviaremos seu pedido o mais breve possível. Obrigado pela preferência! `,
        });

        return res.status(201).json(novoPedido);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};



const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {
        let pedidos = [];

        if (cliente_id) {
            pedidos = await knex("pedidos").where({ cliente_id });

            if (!pedidos[0]) {
                return res.status(404).json({ mensagem: "Pedido não encontrado." });
            }
        } else {
            pedidos = await knex("pedidos");
        }

        const pedidoIds = [];
        const pedido_produtos = await knex("pedido_produtos");

        for (const pedido of pedidos) {
            for (const produto of pedido_produtos) {
                if (produto.pedido_id === pedido.id) {
                    pedidoIds.push(pedido.id);
                    break;
                }
            }
        }

        const resultados = [];

        for (const pedido of pedidos) {
            const produtosDoPedido = [];

            for (const produto of pedido_produtos) {
                if (produto.pedido_id === pedido.id) {
                    produtosDoPedido.push(produto);
                }
            }

            resultados.push({ pedido, pedido_produtos: produtosDoPedido });
        }

        return res.status(200).json(resultados);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    cadastrarPedido,
    listarPedidos,
}