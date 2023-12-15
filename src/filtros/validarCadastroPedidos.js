const validarCadastroPedidos = (req, res, next) => {
    const { cliente_id, pedido_produtos } = req.body;
    const { quantidade_produto, produto_id } = pedido_produtos[0];

    if (!cliente_id) {
        return res.status(404).json({ mensagem: "Informar Id do cliente." });
    } 
    
    if (!produto_id) {
        return res.status(400).json({ mensagem: "É necessário informar a id do produto." });
    }
    if (!quantidade_produto) {
        return res.status(400).json({ mensagem: "É necessário informar a quantidade do produto." });
    }
    
    next();
};

module.exports = validarCadastroPedidos;