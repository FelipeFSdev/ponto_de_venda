const verificarItensLogin = (req, res, next) => {
    const { email, senha } = req.body

    if (!email) {
        return res.status(400).json({ mensagem: "O campo email é obrigatório." });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "O campo senha é obrigatório." });
    }
    next()
};

module.exports = verificarItensLogin