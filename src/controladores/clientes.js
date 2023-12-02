const knex = require('../conexao/conexaopg');

const editarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;
    const { id } = req.params;

    try {
        const emailEncontrado = await knex("clientes").where({ email }).whereNot({ id }).first();
        if (emailEncontrado) {
            return res.status(400).json({ mensagem: "O Email informado já existe." });
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

const detalharCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const cliente = await knex("clientes").where({ id }).first();
        if (!cliente) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }
        return res.status(200).json(cliente);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
}
const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf } = req.body;

    try {
        const cliente = await knex("clientes").insert({
            nome,
            email,
            cpf,
        }).returning(["nome", "email"]);

        return res.status(201).json(cliente);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

const listarClientes = async (req, res) => {
    try {
        const cliente = await knex("clientes");

        res.status(200).json(cliente);

    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

module.exports = {
    editarCliente,
    detalharCliente,
    cadastrarCliente,
    listarClientes
}

