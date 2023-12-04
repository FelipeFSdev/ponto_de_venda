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

    next();
};

module.exports = validarCamposProdutos;