const knex = require('../conexao/conexaopg');

const editarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;
    const { id } = req.params;

    try {
        const emailEncontrado = await knex("clientes").where({ email }).whereNot({ id }).first();
        if (emailEncontrado) {
            return res.status(404).json({ mensagem: "O Email informado já existe." });
        }

        const cpfEncontrado = await knex("clientes").where({ cpf }).whereNot({ id }).first();
        if (cpfEncontrado) {
            return res.status(404).json({ mensagem: "O CPF informado já existe." });
        }

        const cliente = await knex("clientes")
            .update({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado })
            .where({ id }).returning('*');

        if (!cliente[0]) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

module.exports = { editarCliente }