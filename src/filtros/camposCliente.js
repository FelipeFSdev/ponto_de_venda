const validarCliente = (req, res, next) => {
    const { nome, email, cpf } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: "É necessário informar o nome do cliente." });
    }
    if (!email) {
        return res.status(400).json({ mensagem: "É necessário informar o email do cliente." });
    }
    if (!cpf) {
        return res.status(400).json({ mensagem: "É necessário informar o cpf do cliente." });
    }
    if (cpf.length !== 11) {
        return res.status(400).json({ mensagem: "CPF inválido." });
    }

    next();
};

module.exports = validarCliente;