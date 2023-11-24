const knex = require("../conexao/banco de dados");

const verificarEmail = async (req, res, next) => {
    const { email } = req.body
    try {
        const encontrarEmail = await knex("usuarios").where("email", email).first()
        if (encontrarEmail) {
            return res.status(400).json({ mensagem: "Email já cadastrado em nosso banco de dados." });
        };
        next();
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

module.exports = verificarEmail