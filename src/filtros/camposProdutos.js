const validarCamposProdutos = (req, res, next) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    if (!descricao) {
        return res.status(400).json({ mensagem: "É necessário informar a descrição do produto." });
    }
    if (!quantidade_estoque) {
        return res.status(400).json({ mensagem: "É necessário informar a quantidade em estoque." });
    }
    if (!valor) {
        return res.status(400).json({ mensagem: "É necessário informar o valor do produto." });
    }
    if (!categoria_id) {
        return res.status(400).json({ mensagem: "É necessário informar o id da categoria do produto." });
    }
    if (valor < 0) {
        return res.status(400).json({ mensagem: "Valor inválido. Insira um número maior que zero." });
    }
    if (quantidade_estoque < 0) {
        return res.status(400).json({ mensagem: "Quantidade de estoque inválida. Insira um númerio maior que zero." });
    }

    next();
};

module.exports = validarCamposProdutos;