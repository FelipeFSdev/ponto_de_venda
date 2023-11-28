const knex = require("../conexao/conexaopg");

const verificarEmail = async (req, res, next) => {
    const { email } = req.body

    try {
        if (email) {
            const encontrarEmail = await knex("usuarios").where("email", email).first()
            if (encontrarEmail) {
                return res.status(400).json({ mensagem: "Email já cadastrado em nosso banco de dados." });
            };
        }
        next();

    } catch (error) {
        console.log("erro no duplicidade", error.message)
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }

};

module.exports = verificarEmail