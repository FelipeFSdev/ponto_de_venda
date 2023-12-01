const knex = require("../conexao/conexaopg");

const verificarEmail = async (req, res, next) => {
    const { email } = req.body
    try {
        const encontrarEmail = await knex("usuarios").where({ email }).first()
        const encontrarEmailCliente = await knex("clientes").where({ email }).first()
        if (encontrarEmail || encontrarEmailCliente) {
            return res.status(400).json({ mensagem: "Email já cadastrado em nosso banco de dados." });
        };
        next();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }

};
const verificarCpf = async (req, res, next) => {
    const { id } = req.params;
    const { cpf } = req.body;
    try {
        const encontrarCpf = await knex("clientes").where({ cpf }).whereNot({ id }).first()
        if (encontrarCpf) {
            if (encontrarCpf) {
                return res.status(400).json({ mensagem: "CPF já cadastrado em nosso banco de dados." });
            };
        }
        next();
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
}

module.exports = {
    verificarEmail,
    verificarCpf,
}