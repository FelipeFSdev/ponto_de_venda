const validarCliente = (req, res, next) => {
    const { nome, email, cpf } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: "O campo nome é obrigatório." });
    }
    if (!email) {
        return res.status(400).json({ mensagem: "O campo email é obrigatório." });
    }
    if (!cpf) {
        return res.status(400).json({ mensagem: "O campo cpf é obrigatório." });
    }

    next();
};

module.exports = validarCliente;